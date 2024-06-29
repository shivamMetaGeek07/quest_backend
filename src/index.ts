
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import kolsRouter from './routes/kols/kols';
import cors from 'cors';
dotenv.config();
const feedRouter = require("./routes/feed.route");
const app: Express = express();
const port = process.env.PORT || 4500;

app.use( cors() );

app.use( "/feed", feedRouter );

app.get( "/", ( req: Request, res: Response ) =>
{
  res.send( "Express + TypeScript server" );
} );

if (!process.env.MONGO_URL) {
  throw new Error('MONGODB_URI is not defined in the environment variables');
}
const mongoUri: string = process.env.MONGO_URL!;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript server');
});
app.get("/greet", (req: Request, res: Response) => {
  res.send("Express + TypeScript server says Hello");
});

app.use('/kols', kolsRouter);


mongoose.connect(mongoUri, {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});


app.listen(port, () => {
  console.log(`⚡️[server]: Server iS running at http://localhost:${port}`);
});
