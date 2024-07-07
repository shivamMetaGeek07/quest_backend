import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import KolsDB from "../../models/kols/kols";
import Twitter from "twitter-lite";
import UserDb from "../../models/user/user";
dotenv.config();

const publicClientUrl = process.env.PUBLIC_CLIENT_URL as string;

export const loginSuccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "Successfully logged in",
      user: req.user,
    });
  } else {
    res.status(403).json({
      error: true,
      message: "Not authorized",
    });
  }
};

export const loginFailed = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(401).json({
    error: true,
    message: "Login failure",
  });
};

// Logout user


export const logout = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    req.session.destroy(() => {
      res.clearCookie('connect.sid'); 
      res.redirect(`${process.env.PUBLIC_CLIENT_URL}/login`);  
    });
  });
};
// consumer_key: process.env.Twitter_Key!,
//       consumer_secret: process.env.Twitter_Secret_key!,
//       access_token_key: user.twitterInfo.oauthToken,
//       access_token_secret: user.twitterInfo.oauthTokenSecret,
// check in X is Account follw or not

export const checkIfUserFollows = async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const loggedInUser = req.user as any;  // Adjust the type according to your user model
    const { targetUserId } = req.params;

    if (!targetUserId) {
      return res.status(400).json({ message: 'Missing target user ID' });
    }

    // Retrieve Twitter tokens from the logged-in user's profile
    const user = await UserDb.findById(loggedInUser._id);
    if (!user || !user.twitterInfo) {
      return res.status(400).json({ message: 'Twitter account not connected' });
    }

    const client = new Twitter({
        consumer_key: process.env.Twitter_Key!,
        consumer_secret: process.env.Twitter_Secret_key!,
        access_token_key: user.twitterInfo.oauthToken,
        access_token_secret: user.twitterInfo.oauthTokenSecret,
    });

    // Check if the user follows a specific account
    const response = await client.get('friendships/show', {
      source_id: user.twitterInfo.twitterId, // Use Twitter ID for the source user
      target_id: targetUserId,  // Target user ID
    });

    if (response.relationship.source.following) {
      // User is following the target account
      return res.json({ message: 'User follows the account' });
    } else {
      // User is not following the target account
      return res.json({ message: 'User does not follow the account' });
    }
  } catch (error: any) {
    console.error('Error checking if user follows:', error);
    if (error.errors && error.errors[0] && error.errors[0].code === 453) {
      return res.status(403).json({
        error: 'Access to this endpoint is restricted. Please check your Twitter API access level.',
      });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};