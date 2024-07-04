import { NextFunction, Request, Response } from "express";
import User,{ IUser } from "../../models/user/user";

// Middleware to check if the user has connected their  Discord account
export const DiscordConnected = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (req.isAuthenticated()) {
      // If user is authenticated via Passport.js
      const users = req.user as IUser;
      const userId = users._id;
      
      try {
        // Check if the user exists in MongoDB
        const user = await User.findById(userId);
        if (!user) {
          // User not found in the database
             return res.status(401).send('User is not authenticated');
  
        }
        
        // Check if the user has connected their Discord account
        if (user.discordInfo && user.discordInfo.discordId) {
          // User has connected their Discord account, permit the request
          return res.status(401).send('User isAlready registered');
  
        } else {
          // If Discord account is not connected, pass to the next middleware
          return next();
        }
      } catch (error) {
        console.error('Error checking user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    } else {
      // User is not authenticated
      return res.status(401).send('Please Log in');
  
    }
  };
  
  