import { Request, Response, NextFunction } from 'express';

import { AppError } from '../lib/AppError';
import { logger } from '../lib/logger';

// Anything that isn't an AppError but still carries an HTTP status — http-errors
// instances thrown by csrf-csrf are the main case.
function getForeignStatusCode(err: unknown): number | undefined {
  if (typeof err !== 'object' || err === null) return undefined;
  const { statusCode, status } = err as {
    statusCode?: unknown;
    status?: unknown;
  };
  const candidate = typeof statusCode === 'number' ? statusCode : status;
  return typeof candidate === 'number' && candidate >= 400 && candidate <= 599
    ? candidate
    : undefined;
}

function getForeignCode(err: unknown): string | undefined {
  if (typeof err !== 'object' || err === null) return undefined;
  const { code } = err as { code?: unknown };
  return typeof code === 'string' ? code : undefined;
}

function getMessage(err: unknown): string | undefined {
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === 'object' && err !== null) {
    const { message } = err as { message?: unknown };
    if (typeof message === 'string' && message) return message;
  }
  return undefined;
}

// Terminal error handler — must be the LAST app.use() so every thrown error
// lands here instead of Express's built-in handler, which renders an HTML page
// containing the stack trace and absolute filesystem paths.
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // The response is already streaming; only Express can close it out.
  if (res.headersSent) {
    next(err);
    return;
  }

  const appError = err instanceof AppError ? err : undefined;

  const statusCode = appError?.statusCode ?? getForeignStatusCode(err) ?? 500;

  // Only 4xx codes are part of the client contract (EBADCSRFTOKEN and friends).
  // Node system errors carry a `code` too — ECONNREFUSED, ETIMEDOUT — and those
  // describe our infrastructure, so they must never reach the client.
  const code =
    statusCode >= 500 ? undefined : (appError?.code ?? getForeignCode(err));

  // 4xx messages are written for the client. 5xx messages are internal and may
  // carry query text, connection strings or library internals — never send them.
  const message =
    statusCode < 500
      ? (getMessage(err) ?? 'Request failed')
      : 'Internal server error';

  if (statusCode >= 500) {
    // req.log carries the request id pino-http assigned, so the log line and
    // the client's X-Request-Id header can be matched up.
    (req.log ?? logger).error({ err }, 'unhandled error');
  }

  res.status(statusCode).json({
    message,
    ...(code ? { code } : {}),
    ...(statusCode < 500 && appError?.errors
      ? { errors: appError.errors }
      : {}),
  });
}
