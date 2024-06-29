import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import {
  Strategy as TwitterStrategy,
  IStrategyOptionWithRequest,
  Profile as TwitterProfile,
} from "passport-twitter";

import dotenv from "dotenv";
import UserDb, { IUser } from "../models/user/user";
import { Request } from "express";

dotenv.config();

// Google Authentication

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID!,
      clientSecret: process.env.SECRET_ID!,
      callbackURL: "http://localhost:8080/auth/google/callback",
    },
    async (accessToken, refreshToken, profile: Profile, done) => {
      try {
        let user = await UserDb.findOne({ googleId: profile.id });
        if (!user) {
          user = new UserDb({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails?.[0].value,
            image: profile.photos?.[0].value,
          });
          await user.save();
        }

        return done(null, user);
      } catch (error: any) {
        return done(null, error);
      }
    }
  )
);

// To show google acces page every time
GoogleStrategy.prototype.authorizationParams = function () {
  return {
    access_type: "offline",
    prompt: "consent",
  };
};

// Twitter OAuth configuration
passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.Twitter_Key!,
      consumerSecret: process.env.Twitter_Secret_key!,
      callbackURL: "http://localhost:8080/auth/twitter/callback",
      includeEmail: true,
      passReqToCallback: true, // Allows access to the request object in the callback
    } as IStrategyOptionWithRequest, // Type assertion
    async (
      req: Request,
      token: string,
      tokenSecret: string,
      profile: TwitterProfile,
      done: (error: any, user?: any) => void
    ) => {
      try {
        if (!req.user) {
          return done(new Error("User is not authenticated"), null);
        }
        const users = req.user as IUser;
        let user = await UserDb.findById(users._id);
        if (user) {
          user.twitterInfo = {
            twitterId: profile.id,
            username: profile.username,
            profileImageUrl: profile.photos?.[0].value,
          };
          await user.save();
        }
        return done(null, user);
      } catch (error: any) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await UserDb.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
