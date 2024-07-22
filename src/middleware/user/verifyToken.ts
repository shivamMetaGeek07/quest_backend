import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config

export interface jwtUser{
  ids:string,
  phone_number:string,
}

const secretKey = process.env.JWT_SECRET as string;

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    console.log(authHeader)
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }
  // const  {authToken:token}=req.cookies;
  
  // console.log("token",token)
    const token = authHeader.split(' ')[1]; // This removes the "Bearer " prefix
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

    const data= jwt.verify(token, secretKey)

    // If token is valid, store the decoded information in req.user  
    req.user = data;
    next();
};
