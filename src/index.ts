import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript server');
});
app.get('/greet', (req: Request, res: Response) => {
  res.send('Express + TypeScript server says Hello');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server iS running at http://localhost:${port}`);
});