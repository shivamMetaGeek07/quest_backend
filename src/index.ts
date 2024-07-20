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
import userRouter from "./routes/user/user";
import morgan from "morgan";
import {auth} from "./utils/fireAdmin"
import UserDb, { generateToken } from "./models/user/user";
dotenv.config();
const app: Express = express();
app.use( express.json() );
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 8080;

app.use(
  cors({
    origin: process.env.PUBLIC_CLIENT_URL,
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

const verifyPhoneNumberToken = async (idToken:string) => {
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken
  } catch (error) {
    console.error('Error verifying token:', error);
    // Handle the error (e.g., return an unauthorized response)
  }
};
app.post('/api/verify-phone', async(req:Request, res:Response) => {
     const users  = req.body;
    const idToken=users.idToken;
  const name=users.name;
    try {
      const decodedToken = await verifyPhoneNumberToken(idToken); 

      let user;
    if (decodedToken) {
    // Generate JWT token
     user=await UserDb.findOne({phone_number:decodedToken.phone_number});
    if(!user){
      user=new UserDb({
        phone_number:decodedToken.phone_number,
        displayName:name
      });
      await user.save();
    }
    const jwtToken = generateToken({
      ids: user._id as string,
      phone_number: user.phone_number
    });

    res.status(200).json({
      message: 'User authenticated successfully',
      token: jwtToken
    });
  } else {
    res.status(401).send('Authentication failed');
  }
} catch (error) {
  console.error('Error during authentication:', error);
  res.status(401).send('Authentication failed');
}
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
