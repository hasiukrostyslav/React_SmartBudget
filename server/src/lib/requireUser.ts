import { Request } from 'express';

import { AppError } from './AppError';

// req.user is optional in the ambient type because it genuinely is before
// authMiddleware runs. Handlers behind that middleware use this to narrow it
// in one line — and, unlike a per-handler `if (!userId) return 401`, it throws
// if the router wiring ever drops the middleware instead of silently 401ing.
export function requireUser(req: Request): NonNullable<Request['user']> {
  if (!req.user) {
    throw new AppError(401, 'Unauthorized. Please sign in!');
  }
  return req.user;
}
