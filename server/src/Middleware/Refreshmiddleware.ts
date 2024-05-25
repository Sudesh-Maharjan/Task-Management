import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyRefreshToken = (req: Request, res: Response, next: NextFunction) => {
   const refreshToken = req.cookies.refreshToken;

   if (!refreshToken) {
      return res.status(401).send('Access denied. No refresh token provided.');
   }

   try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refreshsecret');
      (req as any).refreshTokenPayload = decoded;
      next();
   } catch (error) {
      res.status(400).send('Invalid refresh token');
   }
};
