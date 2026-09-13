import { Request, Response, NextFunction } from 'express';

import { isProd } from '../config/env';

// Errors reach here in three shapes today:
//   - http-errors instances (thrown by csrf-csrf)      -> { statusCode, code }
//   - service errors from auth.service.ts              -> { status }
//   - anything unexpected (DB, bugs, library failures) -> no status at all
// Normalise them here rather than making every caller agree first.
function getStatusCode(err: unknown): number {
  if (typeof err !== 'object' || err === null) return 500;

  const { statusCode, status } = err as {
    statusCode?: unknown;
    status?: unknown;
  };
  const candidate = typeof statusCode === 'number' ? statusCode : status;

  return typeof candidate === 'number' && candidate >= 400 && candidate <= 599
    ? candidate
    : 500;
}

function getMessage(err: unknown): string | undefined {
  if (typeof err !== 'object' || err === null) return undefined;

  const { message } = err as { message?: unknown };

  return typeof message === 'string' && message.length > 0
    ? message
    : undefined;
}

function getErrorCode(err: unknown): string | undefined {
  if (typeof err !== 'object' || err === null) return undefined;

  const { code } = err as { code?: unknown };

  return typeof code === 'string' ? code : undefined;
}

// Terminal error handler — must be the LAST app.use() so every thrown error
// lands here instead of Express's built-in handler, which renders an HTML page
// containing the stack trace and absolute filesystem paths.
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  // The response is already streaming; only Express can close it out.
  if (res.headersSent) {
    next(err);
    return;
  }

  const statusCode = getStatusCode(err);

  // Only 4xx codes are part of the client contract (EBADCSRFTOKEN and friends).
  // Node system errors carry a `code` too — ECONNREFUSED, ETIMEDOUT — and those
  // describe our infrastructure, so they must never reach the client.
  const code = statusCode < 500 ? getErrorCode(err) : undefined;

  // 4xx messages are written for the client. 5xx messages are internal and may
  // carry query text, connection strings or library internals — never send them.
  const message =
    statusCode < 500
      ? (getMessage(err) ?? 'Request failed')
      : 'Internal server error';

  if (statusCode >= 500) {
    console.error('[unhandled error]', err);
  }

  res.status(statusCode).json({
    message,
    ...(code ? { code } : {}),
    // Development-only: the real cause, so a 500 is debuggable without the logs.
    ...(isProd || statusCode < 500 ? {} : { detail: getMessage(err) }),
  });
}
