
import mongoose from 'mongoose';
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import session from "express-session";
import cors from "cors";
import authrouter from "./routes/user/auth";
import passport from "./utils/passport";
import connectDB from "./utils/db";
import kolsRouter from './routes/kols/kols';

dotenv.config();
const feedRouter = require("./routes/feed.route");
const app: Express = express();
const port = process.env.PORT || 8080;

app.use(
  cors({
    origin: process.env.PUBLIC_CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use( cors() );

// app.use( "/feed", feedRouter );

app.get( "/", ( req: Request, res: Response ) =>
{
  res.send( "Express + TypeScript server" );
} );

if (!process.env.DB_URL) {
  throw new Error('MONGODB_URI is not defined in the environment variables');
}
// const mongoUri: string = process.env.MONGO_URL!;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript server');
});
app.get("/greet", (req: Request, res: Response) => {
  res.send("Express + TypeScript server says Hello");
} );

app.use( express.urlencoded( { extended: true } ) );

console.log(process.env.PUBLIC_CLIENT_URL)
// Middleware setup
app.use(
  session({
    secret: "sswnsnnjdsdfgd",
    resave: false,
    saveUninitialized: true,
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
