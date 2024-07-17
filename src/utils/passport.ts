import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import {
  Strategy as TwitterStrategy,
  IStrategyOptionWithRequest,
  Profile as TwitterProfile,
} from "passport-twitter";
// import  TelegramStrategy, { TelegramProfile }  from 'passport-telegram-official';
// import {} from "passport-telegram";
import { Strategy as DiscordStrategy, Profile as DiscordProfile } from "passport-discord";
import dotenv from "dotenv";
import UserDb, { IUser } from "../models/user/user";
import { Request } from "express";
import KolsDB from "../models/kols/kols";
import { fetchGuilds } from "../controllers/user/discord";

dotenv.config();

// Google Authentication

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID!,
      clientSecret: process.env.SECRET_ID!,
      callbackURL: `${process.env.PUBLIC_SERVER_URL}/auth/google/callback`,
      passReqToCallback: true,  
    },
    async (req: Request, accessToken: any, refreshToken: any, profile: Profile, done: any) => {
      try {
        const role = req.query.state as string;  
        
        let user;
        
        if (role === 'kol') {
          user = await KolsDB.findOne({ googleId: profile.id });
          if (!user) {
            user = new KolsDB({
              googleId: profile.id,
              displayName: profile.displayName,
              email: profile.emails?.[0].value,
              image: profile.photos?.[0].value,
            });
            await user.save();
          }
        } else {
          user = await UserDb.findOne({ googleId: profile.id });

          if (!user) {
            user = new UserDb({
              googleId: profile.id,
              displayName: profile.displayName,
              email: profile.emails?.[0].value,
              image: profile.photos?.[0].value,
            });
            await user.save();
          }
        }

        return done(null, user);
      } catch (error) {
        console.error("Error during authentication:", error);
        return done(error);
      }
    }
  )
);

// To show google acces page every time
 
GoogleStrategy.prototype.authorizationParams = function () {
  return {
    access_type: "offline",
    // prompt: "consent",
  };
};

// Twitter OAuth configuration

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.Twitter_Key!,
      consumerSecret: process.env.Twitter_Secret_key!,
      callbackURL: `${process.env.PUBLIC_SERVER_URL}/auth/twitter/callback`,
      includeEmail: true,
      passReqToCallback: true, 
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
        let user;

        // Check user role and update the appropriate database model
        if (users.role === 'user') {
          user = await UserDb.findById(users._id);
          if (user) {
            user.twitterInfo = {
              twitterId: profile.id,
              username: profile.username,
              profileImageUrl: profile.photos?.[0].value,
              oauthToken: token,
              oauthTokenSecret: tokenSecret,
            };
            await user.save();
          } else {
            return done(new Error("User not found"), null);
          }
        } else if (users.role === 'kol') {
          user = await KolsDB.findById(users._id);
          if (user) {
            user.twitterInfo = {
              twitterId: profile.id,
              username: profile.username,
              profileImageUrl: profile.photos?.[0].value,
              oauthToken: token,
              oauthTokenSecret: tokenSecret,
            };
            await user.save();
          } else {
            return done(new Error("KOL not found"), null);
          }
        } else {
          return done(new Error("Invalid role"), null);
        }

        return done(null, user);
      } catch (error: any) {
        return done(error);
      }
    }
  )
);

// Discord OAUth Authentication

const scopes = ['identify', 'email', 'guilds', 'guilds.join'];
  console.log("first",process.env.DISCORD_ID)
  console.log("second",process.env.DISCORD_SECRET_KEY)
passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_ID!, 
      clientSecret: process.env.DISCORD_SECRET_KEY!,
      callbackURL: `${process.env.PUBLIC_SERVER_URL}/auth/discord/callback`,
      scope: ['identify', 'email', 'guilds', 'guilds.join'],
      passReqToCallback: true,
    },
    async (req: Request, accessToken: string, refreshToken: string, profile: DiscordProfile, done: any) => {
      try {
        if (!req.user) {
          return done(new Error("User is not authenticated"), null);
        }

        const users = req.user as IUser;
        let user;

        // Fetch user guilds
        
        // Check user role and update the appropriate database model
        if (users.role === 'user') {
          user = await UserDb.findById(users._id);
          const guilds = await fetchGuilds(accessToken);
          if (user) {
            user.discordInfo = {
              discordId: profile.id,
              username: profile.username,
              profileImageUrl: profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : undefined,
              accessToken: accessToken,
              refreshToken: refreshToken,
              guilds: guilds.length > 0 ? guilds : undefined,
            };
            await user.save();
          } else {
            return done(new Error("User not found"), null);
          }
        } else if (users.role === 'kol') {
          user = await KolsDB.findById(users._id);
          const guilds = await fetchGuilds(accessToken);
          if (user) {
            user.discordInfo = {
              discordId: profile.id,
              username: profile.username,
              profileImageUrl: profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : undefined,
              accessToken: accessToken,
              refreshToken: refreshToken,
              guilds: guilds.length > 0 ? guilds : undefined,
            };
            await user.save();
          } else {
            return done(new Error("KOL not found"), null);
          }
        } else {
          return done(new Error("Invalid role"), null);
        }

        return done(null, user);
      } catch (error: any) {
        return done(error);
      }
    }
  )
);

// Telegram Authentication   
// passport.use(
//   new TelegramStrategy(
//     {
//       botToken: "7242549217:AAECE1Do2WkQ2j6r6LwlKbp-dQlG4XzHVqU",
//       callbackURL: `${process.env.PUBLIC_SERVER_URL}/auth/telegram/callback`, 
//       passReqToCallback: true,
//       // Corrected callback URL
//     },
//     async (req:Request,profile: TelegramProfile, done: (error: any, user?: any) => void) => {
//       try {
//         const users = req.user as IUser; // Get the currently logged-in user 
        
//         let user = await UserDb.findById(users._id);  // Find the user in the database
        
//         if (user) {
//           // Update or set Telegram information in the user record
//           user.teleInfo = {
//             telegramId: profile.id,
//             teleName: profile.displayName,
//             teleusername: profile.username,
//           };
//           await user.save(); // Save the updated user record
//           return done(null, user); // Pass the user object to the done callback
//         } else {
//           // Handle the case where the user is not found
//           return done(new Error('User not found'), null);
//         }
//       } catch (error) {
//         console.error('Error during Telegram authentication:', error);
//         return done(error);
//       }
//     }
//   )
// );


// passport.use(new Tele)

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    let user = await UserDb.findById(id) || await KolsDB.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
 
export default passport;
