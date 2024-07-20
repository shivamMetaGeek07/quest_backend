import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config

const secretKey = process.env.JWT_SECRET as string;

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }
  
    const token = authHeader.split(' ')[1]; // This removes the "Bearer " prefix
    console.log("das",token);
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Failed to authenticate token' });
    }

    // If token is valid, store the decoded information in req.user 
    req.user = decoded;
    next();
  });
};
