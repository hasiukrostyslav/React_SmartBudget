import { randomUUID } from 'crypto';
import pinoHttp from 'pino-http';

import { logger } from '../lib/logger';

// An incoming id is honoured so a trace can span the proxy or client that
// originated it — but it lands in every log line and the response header, so
// it is bounded and restricted to a safe alphabet. Anything else gets a UUID.
const REQUEST_ID_PATTERN = /^[A-Za-z0-9._-]{1,128}$/;

export const httpLogger = pinoHttp({
  logger,
  // pino-http attaches req.id but does not set a response header, so it's
  // echoed here: same id on the request line, the error line, and the client.
  genReqId: (req, res) => {
    const incoming = req.headers['x-request-id'];
    const id =
      typeof incoming === 'string' && REQUEST_ID_PATTERN.test(incoming)
        ? incoming
        : randomUUID();
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
