import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../../models/user/user"; // Import your User model

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
        // User not found in database (possibly deleted or invalid)
        return res.status(401).json({
          error: "Unauthorized",
          message: "User  found or invalid",
        });
      }

      // Check if the user has connected their Twitter account
      if (user.discordInfo && user.discordInfo.discordId) {
        // User has connected their Twitter account, permit the request

        return res.status(401).json({
          error: "Unauthorized",
          message: "User already exist",
        });
      } else {
        // if it not connected then pass to the next
        return next();
      }
    } catch (error) {
      console.error("Error checking user:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    // User is not authenticated
    return res
      .status(401)
      .json({ error: "Unauthorized", message: "You are not logged in" });
  }
};
