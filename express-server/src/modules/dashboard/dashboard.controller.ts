import { Request, Response } from 'express';

import { requireUser } from '../../lib/requireUser';

// GET /api/dashboard — protected route, requires a valid access token.
// Returns only the identity fields; iat/exp/sub are JWT internals.
export function getDashboard(req: Request, res: Response) {
  const { id, email } = requireUser(req);
  res.json({ message: 'Dashboard data', user: { id, email } });
}
