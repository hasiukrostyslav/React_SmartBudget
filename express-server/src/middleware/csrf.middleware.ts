import { doubleCsrf } from 'csrf-csrf';

import { env, isProd } from '../config/env';

// __Host- prefix enforces Secure + no Domain in production (better security).
export const CSRF_COOKIE_NAME = isProd
  ? '__Host-psifi.x-csrf-token'
  : 'psifi.x-csrf-token';

// Double-submit CSRF pattern: a signed token is stored in a cookie and must
// also be sent in the request header/body.
export const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => env.CSRF_SECRET,
  getSessionIdentifier: () => 'global',
  cookieName: CSRF_COOKIE_NAME,
  cookieOptions: {
    sameSite: (isProd ? 'none' : 'lax') as 'none' | 'lax',
    path: '/',
    httpOnly: false, // must be JS-readable so the client can attach it to requests
    secure: isProd,
  },
  ignoredMethods: ['GET'],
});
