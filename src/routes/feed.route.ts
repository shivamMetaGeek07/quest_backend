import express, {  Request, Response } from "express";
const fs = require("fs");
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const feedRouter = express.Router();

feedRouter.use(express.json());

feedRouter.get("/", (req: Request, res: Response) => {
  try {
    const data = JSON.parse(fs.readFileSync(path.join("./db.json"), "utf8"));
    // console.log(data);
    res.json(data);
  } catch (error) {
    console.error("Error reading feed data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = feedRouter;
