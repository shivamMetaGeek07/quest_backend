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
import taskRouter from "./routes/task/task.route";
import crypto from 'crypto';
import userRouter from "./routes/user/user";

dotenv.config();
const app: Express = express();
app.use( express.json() );

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 8080;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
console.log(TELEGRAM_BOT_TOKEN)
const SECRET_KEY = crypto.createHash('sha256').update(TELEGRAM_BOT_TOKEN).digest();

app.use(
  cors({
    origin: process.env.PUBLIC_CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    optionsSuccessStatus: 200,
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
app.use( '/community', communityRoute );

app.use('/task', taskRouter)

app.use(passport.initialize());
app.use(passport.session());
// Google auth route
app.use("/auth", authrouter);
app.use("/user", userRouter);
app.use('/kols', kolsRouter);
app.use('/admin', adminRoutes);
app.use('/aws',s3routes);


app.post('/auth/telegram/callback', (req, res) => {
  const { hash, ...user } = req.body as { [key: string]: string };
  const dataCheckString = Object.keys(user)
    .sort()
    .map(key => `${key}=${user[key]}`)
    .join('\n');
  const hmac = crypto.createHmac('sha256', SECRET_KEY).update(dataCheckString).digest('hex');

  if (hmac !== hash) {
    return res.status(403).send('Authentication failed: Invalid hash.');
  }

  // At this point, the user is authenticated
  // You can save the user data to your database here

  res.send(`Hello, ${user.first_name}! Your Telegram ID is ${user.id}`);
});
 

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
