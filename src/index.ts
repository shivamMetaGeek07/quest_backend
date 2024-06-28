import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import session from "express-session";
import cors from "cors";
import authrouter from "./routes/auth";
import passport from "./utils/passport";
import connectDB from "./utils/db";

dotenv.config();

const app: Express = express();
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 8050;

// Middleware setup
app.use(
  session({
    secret: "sswnsnnjdsdfgd",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
// Google auth route
app.use("/auth", authrouter);

// Example routes
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript server");
});

app.get("/greet", (req: Request, res: Response) => {
  res.send("Express + TypeScript server says Hello");
  console.log("this is", process.env.SECRET_ID);
});

// Start server
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  connectDB();
});
