import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../../models/user/user"; // Import your User model

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    // If user is authenticaeed via Passport.js

    const users = req.user as IUser;
    const userId = users._id;
    try {
      // Check if the user exists in MongoDB
      const user = await User.findById(userId);
      if (user) {
        return next();
      } else {
        // User not found in database (possibly deleted or invalid)
        return res.status(401).json({
          error: "Unauthorized",
          message: "User not found or invalid",
        });
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
