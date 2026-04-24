import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extracts and verifies the JWT access token from the httpOnly cookie.
// Mirrors the AuthGuard from the NestJS server.
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies['access_token'] as string | undefined;

  if (!token) {
    res.status(401).json({ message: 'Access token is missing' });
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as {
      sub: string;
      email: string;
      iat: number;
      exp: number;
    };

    // Spread full payload and add id as alias for sub — mirrors AuthGuard behaviour
    req.user = { ...payload, id: payload.sub };
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired access token' });
  }
}
