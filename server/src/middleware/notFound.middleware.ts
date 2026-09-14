import { Request, Response, NextFunction } from 'express';

import { AppError } from '../lib/AppError';

// Registered after every router and before the error handler, so an unmatched
// path yields the same JSON shape as every other error instead of Express's
// default HTML "Cannot GET /path" page.
export function notFoundHandler(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  next(new AppError(404, `Route not found: ${req.method} ${req.path}`));
}
