import express, { Request, Response } from "express";
import passport from "../utils/passport";
import { loginFailed, loginSuccess, logout } from "../controllers/User/auth";
import { isAuthenticated } from "../middleware/authorize.user";

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

authrouter.get("/login/success", loginSuccess);

authrouter.get("/login/failed", loginFailed);

// authrouter.get("/protected", authenticateUser, (req, res) => {
//   res.json({ user: req.user });
// });
authrouter.get("/profile", isAuthenticated, (req, res) => {
  // req.user contains the authenticated user object
  res.json({ user: req.user });
});
authrouter.get("/logout", logout);

export default authrouter;
