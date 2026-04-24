export const SALT_ROUNDS = 10;

const isProd = process.env.NODE_ENV === 'production';

export const ACCESS_TOKEN_COOKIE_OPTIONS = {
  secure: isProd,
  httpOnly: true,
  sameSite: (isProd ? 'none' : 'lax') as 'none' | 'lax',
  path: '/',
  maxAge: 15 * 60 * 1000,
};

export const REFRESH_TOKEN_COOKIE_OPTIONS = {
  secure: isProd,
  httpOnly: true,
  sameSite: (isProd ? 'none' : 'lax') as 'none' | 'lax',
  path: '/api/auth/refresh',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
