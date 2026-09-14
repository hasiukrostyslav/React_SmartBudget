import { isProd } from './env';
import { ACCESS_TOKEN_TTL_SECONDS, REFRESH_TOKEN_TTL_SECONDS } from './tokens';

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
  maxAge: ACCESS_TOKEN_TTL_SECONDS * 1000,
};

export const REFRESH_TOKEN_COOKIE_OPTIONS = {
  ...REFRESH_TOKEN_CLEAR_OPTIONS,
  maxAge: REFRESH_TOKEN_TTL_SECONDS * 1000,
};
