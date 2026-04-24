import { Request, Response } from 'express';

// GET /api/dashboard — protected route, requires a valid access token
export function getDashboard(req: Request, res: Response) {
  res.json({ message: 'Dashboard data', user: req.user });
}
