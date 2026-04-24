import { doubleCsrf } from 'csrf-csrf';

const isProd = process.env.NODE_ENV === 'production';

// __Host- prefix enforces Secure + no Domain in production (better security).
export const CSRF_COOKIE_NAME = isProd
  ? '__Host-psifi.x-csrf-token'
  : 'psifi.x-csrf-token';

// Double-submit CSRF pattern: a signed token is stored in a cookie and must
// also be sent in the request header/body. Mirrors the NestJS main.ts setup.
export const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET as string,
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
