import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
const cors = require("cors");

dotenv.config();
const feedRouter = require("./routes/feed.route");
const app: Express = express();
const port = process.env.PORT || 4500;

app.use( cors() );

app.use( "/feed", feedRouter );

app.get( "/", ( req: Request, res: Response ) =>
{
  res.send("Express + TypeScript server");
});
app.get("/greet", (req: Request, res: Response) => {
  res.send("Express + TypeScript server says Hello");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server iS running at http://localhost:${port}`);
});
