import { ApiError } from '@/services/apiError';

const MAX_RETRIES = 2;

// A 4xx won't succeed on retry: the request is wrong, the user isn't allowed,
// or they're rate-limited. 401s are already retried once, after a token
// refresh, by the axios interceptor. Network failures and 5xx get two retries.
export function shouldRetryQuery(
  failureCount: number,
  error: unknown,
): boolean {
  const isClientError =
    error instanceof ApiError && error.status >= 400 && error.status < 500;
  return !isClientError && failureCount < MAX_RETRIES;
}
