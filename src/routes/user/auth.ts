import express, { Request, Response } from "express";
import passport from "../../utils/passport";
import { loginFailed, loginSuccess, logout } from "../../controllers/user/auth";
import { isAuthenticated } from "../../middleware/user/authorize.user";
import { TwitterConnected } from "../../middleware/user/twitter";

const authrouter = express.Router();

authrouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authrouter.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/callback",
    failureRedirect: "http://localhost:3000/failed",
  })
);
// Connect twitter account of user and check it is authenticate or not
authrouter.get(
  "/twitter",
  isAuthenticated,
  TwitterConnected,
  passport.authenticate("twitter")
);
authrouter.get(
  "/twitter/callback",
  passport.authenticate("twitter", {
    successRedirect: "http://localhost:3000/",
    failureRedirect: "http://localhost:3000/failed",
  })
);

authrouter.get("/login/success", loginSuccess);

authrouter.get("/login/failed", loginFailed);

authrouter.get("/profile", (req, res) => {
  res.json({ user: req.user });
});

authrouter.get("/logout", logout);

export default authrouter;
