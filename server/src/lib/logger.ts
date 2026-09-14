import pino from 'pino';

import { env, isProd } from '../config/env';

const isTest = env.NODE_ENV === 'test';

export const logger = pino({
  level: isTest ? 'silent' : isProd ? 'info' : 'debug',
  // Structured JSON in production for the platform's log pipeline; readable
  // lines locally. The pretty transport is a worker thread, so it stays off
  // under test where it would keep the runner alive.
  transport:
    isProd || isTest
      ? undefined
      : { target: 'pino-pretty', options: { colorize: true } },
  // Cookies carry the auth and refresh tokens — never write them to a log.
  redact: {
    paths: [
      'req.headers.cookie',
      'req.headers.authorization',
      'res.headers["set-cookie"]',
    ],
    censor: '[redacted]',
  },
});
