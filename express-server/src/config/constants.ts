import { isProd } from './env';

export const SALT_ROUNDS = 10;

// clearCookie only clears a cookie whose flags and path match the ones it was
// set with. Sharing one base keeps the set/clear pairs from drifting apart —
// the refresh cookie's unusual path made that a silent logout failure.
const BASE_COOKIE_OPTIONS = {
  secure: isProd,
  httpOnly: true,
  sameSite: (isProd ? 'none' : 'lax') as 'none' | 'lax',
};

export const ACCESS_TOKEN_CLEAR_OPTIONS = {
  ...BASE_COOKIE_OPTIONS,
  path: '/',
};

export const REFRESH_TOKEN_CLEAR_OPTIONS = {
  ...BASE_COOKIE_OPTIONS,
  path: '/api/auth/refresh',
};

export const ACCESS_TOKEN_COOKIE_OPTIONS = {
  ...ACCESS_TOKEN_CLEAR_OPTIONS,
  maxAge: 15 * 60 * 1000,
};

export const REFRESH_TOKEN_COOKIE_OPTIONS = {
  ...REFRESH_TOKEN_CLEAR_OPTIONS,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
