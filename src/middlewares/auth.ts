import AuthService from "@src/services/auth";
import { NextFunction, Request, Response } from "express";

export function authMiddleware(
  req: Partial<Request>,
  res: Partial<Response>, next:
  NextFunction
): void {  
  try {
    if (
      req &&
      req.headers &&
      req.headers.authorization &&
      req.headers.authorization.includes('Bearer ')
    ) {
      const token = req.headers.authorization.split(' ')[1];
      req.user = AuthService.decodeToken(token)
      next();
    } else {
      res.status?.(401).send({ message: 'invalid token'});
    }
  } catch (error) { 
    res.status?.(401).send({ message: error.message });
  }
}