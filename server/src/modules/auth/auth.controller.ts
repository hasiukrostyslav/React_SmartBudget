import { Request, Response } from 'express';

import {
  ACCESS_TOKEN_CLEAR_OPTIONS,
  ACCESS_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_CLEAR_OPTIONS,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from '../../config/cookies';
import { requireUser } from '../../lib/requireUser';
import {
  CSRF_COOKIE_NAME,
  CSRF_COOKIE_OPTIONS,
  generateCsrfToken,
} from '../../middleware/csrf.middleware';
import { findUserById } from '../users/users.service';
import { login, refreshTokens, signup } from './auth.service';
import { Tokens } from './auth.types';

// These handlers don't catch. Express 5 forwards a rejected promise to the
// error middleware on its own, which is what gives a DB outage a logged 500
// instead of a flat, unlogged one.

function setAuthCookies(res: Response, tokens: Tokens) {
  res.cookie('access_token', tokens.access_token, ACCESS_TOKEN_COOKIE_OPTIONS);
  res.cookie(
    'refresh_token',
    tokens.refresh_token,
    REFRESH_TOKEN_COOKIE_OPTIONS,
  );
}

// clearCookie only matches on the flags a cookie was SET with, so every one of
// these comes from the module that set it rather than being restated.
function clearAuthCookies(res: Response) {
  res.clearCookie('access_token', ACCESS_TOKEN_CLEAR_OPTIONS);
  res.clearCookie('refresh_token', REFRESH_TOKEN_CLEAR_OPTIONS);
  res.clearCookie(CSRF_COOKIE_NAME, CSRF_COOKIE_OPTIONS);
}

// POST /api/auth/login
export async function loginController(req: Request, res: Response) {
  const { tokens, user } = await login(req.body);
  setAuthCookies(res, tokens);
  res.json({ success: true, user: { email: user.email } });
}

// POST /api/auth/signup
export async function signupController(req: Request, res: Response) {
  const { tokens, user } = await signup(req.body);
  setAuthCookies(res, tokens);
  res.status(201).json({ success: true, user: { email: user.email } });
}

// POST /api/auth/refresh — rotates both tokens using the refresh token cookie
export async function refreshController(req: Request, res: Response) {
  const refreshToken = req.cookies['refresh_token'] as string | undefined;

  if (!refreshToken) {
    res.status(401).json({ message: 'Refresh token is missing' });
    return;
  }

  const tokens = await refreshTokens(refreshToken);
  setAuthCookies(res, tokens);
  res.json({ success: true });
}

// POST /api/auth/signout — clears all auth and CSRF cookies. Exempt from CSRF
// via skipCsrfProtection in csrf.middleware.ts.
export function signoutController(_req: Request, res: Response) {
  clearAuthCookies(res);
  res.json({ message: 'Logged out' });
}

// GET /api/auth/session — returns the authenticated user's profile (requires authMiddleware)
export async function sessionController(req: Request, res: Response) {
  const { id, exp } = requireUser(req);
  const user = await findUserById(id);

  if (!user) {
    res.status(401).json({ message: 'User not found' });
    return;
  }

  res.json({
    isAuthenticated: true,
    // exp is Unix seconds — convert to ISO string to match the original server
    expires: new Date(exp * 1000).toISOString(),
    user: { id: user.id, email: user.email, name: user.name },
  });
}

// GET /api/auth/csrf-token — returns a fresh CSRF token (no protection required on this GET)
export function csrfTokenController(req: Request, res: Response) {
  const csrfToken = generateCsrfToken(req, res);
  res.json({ success: true, csrfToken });
}
