import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
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

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect(publicClientUrl);
  });
};
