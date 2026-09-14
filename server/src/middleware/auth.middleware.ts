import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { env } from '../config/env';
import { AppError } from '../lib/AppError';

// Extracts and verifies the JWT access token from the httpOnly cookie.
// Failures go through next() so the error middleware renders and logs them.
export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const token = req.cookies['access_token'] as string | undefined;

  if (!token) {
    next(new AppError(401, 'Access token is missing'));
    return;
  }

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as {
      sub: string;
      email: string;
      iat: number;
      exp: number;
    };

    // Spread full payload and add id as alias for sub
    req.user = { ...payload, id: payload.sub };
    next();
  } catch {
    next(new AppError(401, 'Invalid or expired access token'));
  }
}
