import express, { Request, Response } from "express";
import dotenv from "dotenv";
import passport from "../../utils/passport";
import { loginFailed, loginSuccess, logout } from "../../controllers/user/auth";
import { isAuthenticated } from "../../middleware/user/authorize.user";
import { TwitterConnected } from "../../middleware/user/twitter";
dotenv.config();

const authrouter = express.Router();

authrouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authrouter.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.PUBLIC_CLIENT_URL,
    failureRedirect: `${process.env.PUBLIC_CLIENT_URL}/failed`,
  })
);


// Connect twitter account  of user and check it is authenticate or not
authrouter.get(
  "/twitter",
  isAuthenticated,
  TwitterConnected,
  passport.authenticate("twitter")
);

authrouter.get(
  "/twitter/callback",
  passport.authenticate("twitter", {
    successRedirect: process.env.PUBLIC_CLIENT_URL,
    failureRedirect: `${process.env.PUBLIC_CLIENT_URL}/failed`,
     })
);

authrouter.get("/login/success", loginSuccess);

authrouter.get("/login/failed", loginFailed);

authrouter.get("/profile",isAuthenticated,  (req, res) => {
  res.json({ user: req.user });
});

authrouter.get("/logout", logout);

export default authrouter;
