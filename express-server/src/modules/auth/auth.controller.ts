import { Request, Response } from 'express';
import { login, signup, refreshAccessToken } from './auth.service';
import { findUserById } from '../users/users.service';
import { generateCsrfToken, CSRF_COOKIE_NAME } from '../../middleware/csrf.middleware';
import { ACCESS_TOKEN_COOKIE_OPTIONS, REFRESH_TOKEN_COOKIE_OPTIONS } from '../../config/constants';

const isProd = process.env.NODE_ENV === 'production';

function setAuthCookies(res: Response, access_token: string, refresh_token: string) {
  res.cookie('access_token', access_token, ACCESS_TOKEN_COOKIE_OPTIONS);
  res.cookie('refresh_token', refresh_token, REFRESH_TOKEN_COOKIE_OPTIONS);
}

function handleError(res: Response, err: any) {
  res.status(err?.status ?? 500).json({ message: err?.message ?? 'Internal server error' });
}

// POST /api/auth/login
export async function loginController(req: Request, res: Response) {
  try {
    const { tokens, user } = await login(req.body);
    setAuthCookies(res, tokens.access_token, tokens.refresh_token);
    res.json({ success: true, user: { email: user.email } });
  } catch (err) {
    handleError(res, err);
  }
}

// POST /api/auth/signup
export async function signupController(req: Request, res: Response) {
  try {
    const { tokens, user } = await signup(req.body);
    setAuthCookies(res, tokens.access_token, tokens.refresh_token);
    res.json({ success: true, user: { email: user.email } });
  } catch (err) {
    handleError(res, err);
  }
}

// POST /api/auth/refresh — issues a new access token using the refresh token cookie
export async function refreshController(req: Request, res: Response) {
  const refreshToken = req.cookies['refresh_token'] as string | undefined;

  if (!refreshToken) {
    res.status(401).json({ message: 'Refresh token is missing' });
    return;
  }

  try {
    const access_token = await refreshAccessToken(refreshToken);
    res.cookie('access_token', access_token, ACCESS_TOKEN_COOKIE_OPTIONS);
    res.json({ success: true });
  } catch (err) {
    handleError(res, err);
  }
}

// POST /api/auth/signout — clears all auth and CSRF cookies (CSRF check bypassed in app.ts)
export function signoutController(req: Request, res: Response) {
  const sameSite = isProd ? ('none' as const) : ('lax' as const);

  res.clearCookie('access_token', { secure: isProd, httpOnly: true, sameSite, path: '/' });
  res.clearCookie('refresh_token', {
    secure: isProd,
    httpOnly: true,
    sameSite,
    path: '/api/auth/refresh',
  });
  res.clearCookie(CSRF_COOKIE_NAME, {
    secure: isProd,
    httpOnly: false,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
  });

  res.json({ message: 'Logged out' });
}

// GET /api/auth/session — returns the authenticated user's profile (requires authMiddleware)
export async function sessionController(req: Request, res: Response) {
  try {
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
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
}

// GET /api/auth/csrf-token — returns a fresh CSRF token (no protection required on this GET)
export function csrfTokenController(req: Request, res: Response) {
  const csrfToken = generateCsrfToken(req, res);
  res.json({ success: true, csrfToken });
}
