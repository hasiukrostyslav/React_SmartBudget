// Per-field validation messages, as zod's flatten() produces them.
export type FieldErrors = Record<string, string[] | undefined>;

// The one error type services and middleware throw. Carries an HTTP status so
// the error middleware can render it, and a real stack so the origin is
// debuggable — the previous `{ status, message }` object literal had neither.
export class AppError extends Error {
  readonly statusCode: number;
  // Machine-readable code the client can branch on. Rendered on 4xx only.
  readonly code?: string;
  // Rendered as `errors` on the response so a form can map them to fields.
  readonly errors?: FieldErrors;

  constructor(
    statusCode: number,
    message: string,
    options: { code?: string; errors?: FieldErrors } = {},
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = options.code;
    this.errors = options.errors;
    Error.captureStackTrace?.(this, AppError);
  }
}
