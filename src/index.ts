import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import session from "express-session";
import cors from "cors";
import authrouter from "./routes/user/auth";
import passport from "./utils/passport";
import connectDB from "./utils/db";
import kolsRouter from './routes/kols/kols';
import feedRouter from "./routes/feed.route"
import questsRouter from "./routes/quests/quests.route";
import communityRoute from "./routes/community/community.route";
import Bottleneck from "bottleneck";
import adminRoutes from './routes/admin/admin';
import s3routes from "./routes/s3routes";

dotenv.config();
const app: Express = express();
app.use( express.json() );

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 8080;

app.use(
  cors({
    origin: process.env.PUBLIC_CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Middleware setup  
app.use(
  session({
    secret: "sswnsnnjdsdfgd",
    resave: false,
    saveUninitialized: true,
  })
);

app.use( '/feed', feedRouter );

app.use( "/quest", questsRouter );
app.use('/community', communityRoute);

app.use(passport.initialize());
app.use(passport.session());
// Google auth route
app.use("/auth", authrouter);
app.use('/kols', kolsRouter);
app.use('/admin', adminRoutes);
app.use('/aws',s3routes);

// Example route
app.get('/', (req: Request, res: Response) => {
  
  res.send('Express + TypeScript server');
});
app.get("/greet", (req: Request, res: Response) => {
  res.send("Express + TypeScript server says Hello");
} );

 
// Start server
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  connectDB();

} );
