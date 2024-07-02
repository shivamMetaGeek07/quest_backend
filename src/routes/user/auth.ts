import express, { Request, Response } from "express";
import dotenv from "dotenv";

import passport from "../../utils/passport";
import { checkIfUserFollows, loginFailed, loginSuccess, logout } from "../../controllers/user/auth";
import { isAuthenticated } from "../../middleware/user/authorize.user";
import { TwitterConnected } from "../../middleware/user/twitter";
import { DiscordConnected } from "../../middleware/user/discord";
dotenv.config();

const authrouter = express.Router();

// Google route

authrouter.get(
  "/google/kol",
  (req, res, next) => {
    req.query.state = 'kol';  
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: 'kol',  
    })(req, res, next);
  }
);

authrouter.get(
  "/google/user",
  (req, res, next) => {
    req.query.state = 'user'; 
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: 'user',  
    })(req, res, next);
  }
);

// Google OAuth callback route

authrouter.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.PUBLIC_CLIENT_URL}/failed`,
  }),
  (req, res) => { 
    res.redirect(`${process.env.PUBLIC_CLIENT_URL}/kols-profile`);
  }
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
    successRedirect:`${process.env.PUBLIC_CLIENT_URL}/kols-profile`,
    failureRedirect: `${process.env.PUBLIC_CLIENT_URL}/failed`,
     })
);

// Connect Discord account  of user and check it is authenticate or not

authrouter.get(
  "/discord",
  isAuthenticated,
  DiscordConnected,
  passport.authenticate("discord")
);

authrouter.get(
  "/discord/callback",
  passport.authenticate("discord", {
    successRedirect:`${process.env.PUBLIC_CLIENT_URL}/kols-profile`,
    failureRedirect: `${process.env.PUBLIC_CLIENT_URL}/failed`,
     })
);



authrouter.get("/twitter/follows/:targetUserId", isAuthenticated, checkIfUserFollows);

authrouter.get("/login/success", loginSuccess);

authrouter.get("/login/failed", loginFailed);

authrouter.get("/profile",isAuthenticated,  (req, res) => {
  res.json({ user: req.user });
});

authrouter.get("/logout",isAuthenticated, logout);

export default authrouter;
