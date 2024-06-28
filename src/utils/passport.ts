import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import dotenv from "dotenv";
import UserDb from "../models/user";

dotenv.config();

const googleScopes = ["profile", "email"];

console.log("GOOGLE_CLIENT_ID:", process.env.CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET:", process.env.SECRET_ID);

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
