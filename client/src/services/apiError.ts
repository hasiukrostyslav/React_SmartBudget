import { isAxiosError } from 'axios';

// The one error type the service layer throws. A plain Error kept only the
// message, so callers could not tell a 401 from a 404 from a network failure.
export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

const FALLBACK_MESSAGE = 'Something went wrong. Please try again.';

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
      | { message?: unknown; code?: unknown }
      | undefined;
    const message =
      typeof data?.message === 'string' && data.message
        ? data.message
        : FALLBACK_MESSAGE;
    const code = typeof data?.code === 'string' ? data.code : undefined;

    return new ApiError(message, error.response.status, code);
  }

  return new ApiError(FALLBACK_MESSAGE, 500);
}
