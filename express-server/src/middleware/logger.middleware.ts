import { randomUUID } from 'crypto';
import pino from 'pino';
import pinoHttp from 'pino-http';

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

export const httpLogger = pinoHttp({
  logger,
  // Same id on the request log line, the error log line, and the client's
  // response. pino-http attaches req.id but does not set a response header,
  // so it's echoed here. An incoming id is honoured so a trace can span the
  // proxy or client that originated it.
  genReqId: (req, res) => {
    const incoming = req.headers['x-request-id'];
    const id =
      typeof incoming === 'string' && incoming ? incoming : randomUUID();
    res.setHeader('X-Request-Id', id);
    return id;
  },
  customLogLevel: (_req, res, error) => {
    if (error || res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  // Liveness probes fire every few seconds; they'd drown the real traffic.
  autoLogging: { ignore: (req) => req.url === '/health' },
});
