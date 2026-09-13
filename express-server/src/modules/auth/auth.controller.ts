import { Request, Response } from 'express';

import {
  ACCESS_TOKEN_CLEAR_OPTIONS,
  ACCESS_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_CLEAR_OPTIONS,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from '../../config/cookies';
import { isProd } from '../../config/env';
import {
  CSRF_COOKIE_NAME,
  generateCsrfToken,
} from '../../middleware/csrf.middleware';
import { findUserById } from '../users/users.service';
import { login, refreshAccessToken, signup } from './auth.service';

// These handlers no longer catch. Express 5 forwards a rejected promise to the
// error middleware on its own, which is what gives a DB outage a logged 500
// instead of the flat, unlogged 500 the old local handler produced for every
// failure regardless of cause.

function setAuthCookies(
  res: Response,
  access_token: string,
  refresh_token: string,
) {
  res.cookie('access_token', access_token, ACCESS_TOKEN_COOKIE_OPTIONS);
  res.cookie('refresh_token', refresh_token, REFRESH_TOKEN_COOKIE_OPTIONS);
}

// clearCookie only matches on the flags a cookie was SET with, so these are
// derived from the same constants rather than restated.
function clearAuthCookies(res: Response) {
  res.clearCookie('access_token', ACCESS_TOKEN_CLEAR_OPTIONS);
  res.clearCookie('refresh_token', REFRESH_TOKEN_CLEAR_OPTIONS);
  res.clearCookie(CSRF_COOKIE_NAME, {
    secure: isProd,
    httpOnly: false,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
  });
}

// POST /api/auth/login
export async function loginController(req: Request, res: Response) {
  const { tokens, user } = await login(req.body);
  setAuthCookies(res, tokens.access_token, tokens.refresh_token);
  res.json({ success: true, user: { email: user.email } });
}

// POST /api/auth/signup
export async function signupController(req: Request, res: Response) {
  const { tokens, user } = await signup(req.body);
  setAuthCookies(res, tokens.access_token, tokens.refresh_token);
  res.status(201).json({ success: true, user: { email: user.email } });
}

// POST /api/auth/refresh — issues a new access token using the refresh token cookie
export async function refreshController(req: Request, res: Response) {
  const refreshToken = req.cookies['refresh_token'] as string | undefined;

  if (!refreshToken) {
    res.status(401).json({ message: 'Refresh token is missing' });
    return;
  }

  const access_token = await refreshAccessToken(refreshToken);
  res.cookie('access_token', access_token, ACCESS_TOKEN_COOKIE_OPTIONS);
  res.json({ success: true });
}

// POST /api/auth/signout — clears all auth and CSRF cookies (CSRF check bypassed in app.ts)
export function signoutController(_req: Request, res: Response) {
  clearAuthCookies(res);
  res.json({ message: 'Logged out' });
}

// GET /api/auth/session — returns the authenticated user's profile (requires authMiddleware)
export async function sessionController(req: Request, res: Response) {
  const jwtUser = req.user as { id: string; exp: number };
  const user = await findUserById(jwtUser.id);

  if (!user) {
    res.status(401).json({ message: 'User not found' });
    return;
  }

  res.json({
    isAuthenticated: true,
    // exp is Unix seconds — convert to ISO string to match the original server
    expires: new Date(jwtUser.exp * 1000).toISOString(),
    user: { id: user.id, email: user.email, name: user.name },
  });
}

// GET /api/auth/csrf-token — returns a fresh CSRF token (no protection required on this GET)
export function csrfTokenController(req: Request, res: Response) {
  const csrfToken = generateCsrfToken(req, res);
  res.json({ success: true, csrfToken });
}
