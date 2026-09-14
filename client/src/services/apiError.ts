import { isAxiosError } from 'axios';

// Per-field validation messages, as the API sends them on a 400.
export type FieldErrors = Record<string, string[] | undefined>;

// The one error type the service layer throws. A plain Error kept only the
// message, so callers could not tell a 401 from a 404 from a network failure,
// and the API's per-field validation errors were lost.
export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly fieldErrors?: FieldErrors;

  constructor(
    message: string,
    status: number,
    code?: string,
    fieldErrors?: FieldErrors,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

const FALLBACK_MESSAGE = 'Something went wrong. Please try again.';

function isFieldErrors(value: unknown): value is FieldErrors {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every(
      (messages) =>
        messages === undefined ||
        (Array.isArray(messages) &&
          messages.every((message) => typeof message === 'string')),
    )
  );
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (isAxiosError(error)) {
    // No response means the request never reached the server: offline, CORS,
    // or a timeout. There is no body to read a message from.
    if (!error.response) {
      return new ApiError(
        'Unable to reach the server. Check your connection and try again.',
        0,
      );
    }

    // The body is usually the API's JSON error, but a proxy or platform error
    // page arrives as an HTML string, so nothing about its shape is assumed.
    const data = error.response.data as
      | { message?: unknown; code?: unknown; errors?: unknown }
      | undefined;
    const message =
      typeof data?.message === 'string' && data.message
        ? data.message
        : FALLBACK_MESSAGE;
    const code = typeof data?.code === 'string' ? data.code : undefined;
    const fieldErrors = isFieldErrors(data?.errors) ? data.errors : undefined;

    return new ApiError(message, error.response.status, code, fieldErrors);
  }

  return new ApiError(FALLBACK_MESSAGE, 500);
}
