// The one error type services throw. Carries an HTTP status so the error
// middleware can render it, and a real stack so the origin is debuggable —
// the previous `{ status, message }` object literal had neither.
export class AppError extends Error {
  readonly statusCode: number;
  // Optional machine-readable code the client can branch on (4xx only).
  readonly code?: string;

  constructor(statusCode: number, message: string, code?: string) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    Error.captureStackTrace?.(this, AppError);
  }
}
