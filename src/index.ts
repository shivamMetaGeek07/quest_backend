import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import session from "express-session";
import cors from "cors";
import authrouter from "./routes/user/auth";
import passport from "./utils/passport";
import connectDB from "./utils/db";
import kolsRouter from './routes/kols/kols';

dotenv.config();

const app: Express = express();
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 8050;
console.log(process.env.PUBLIC_CLIENT_URL)

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
    origin: process.env.PUBLIC_CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
// Google auth route
app.use("/auth", authrouter);
app.use('/kols', kolsRouter);

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
