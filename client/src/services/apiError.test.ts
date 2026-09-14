import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, it } from 'vitest';

import { ApiError, toApiError } from './apiError';

function httpError(
  status: number,
  data: unknown,
  headers: Record<string, string> = {},
) {
  const config = { headers: new AxiosHeaders() };
  return new AxiosError(
    'Request failed',
    AxiosError.ERR_BAD_RESPONSE,
    config,
    undefined,
    { status, statusText: '', data, headers, config },
  );
}

describe('toApiError', () => {
  it('reports a request that never got a response as unreachable', () => {
    const error = toApiError(
      new AxiosError('Network Error', AxiosError.ERR_NETWORK),
    );

    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(0);
    expect(error.message).toMatch(/unable to reach the server/i);
  });

  it("keeps the API's message, code and field errors", () => {
    const error = toApiError(
      httpError(400, {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        errors: { amount: ['Amount must be a positive number.'] },
      }),
    );

    expect(error.status).toBe(400);
    expect(error.message).toBe('Validation failed');
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.fieldErrors?.amount).toEqual([
      'Amount must be a positive number.',
    ]);
  });

  it('falls back to a generic message for a non-JSON error page', () => {
    const error = toApiError(httpError(502, '<html>Bad gateway</html>'));

    expect(error.status).toBe(502);
    expect(error.message).toBe('Something went wrong. Please try again.');
  });

  it('drops field errors that are not lists of strings', () => {
    const error = toApiError(
      httpError(400, { message: 'Bad', errors: { amount: 'not a list' } }),
    );

    expect(error.fieldErrors).toBeUndefined();
  });

  it.each([
    ['30', 'Too many requests. Please try again in 30 seconds.'],
    ['1', 'Too many requests. Please try again in 1 second.'],
    ['60', 'Too many requests. Please try again in 1 minute.'],
    ['90', 'Too many requests. Please try again in 2 minutes.'],
  ])(
    'tells a rate-limited user when to retry (reset %ss)',
    (reset, message) => {
      const error = toApiError(
        httpError(
          429,
          { message: 'Too many requests' },
          { 'ratelimit-reset': reset },
        ),
      );

      expect(error.status).toBe(429);
      expect(error.message).toBe(message);
    },
  );

  it('uses the body message on a 429 without a usable reset header', () => {
    const error = toApiError(httpError(429, { message: 'Slow down' }));

    expect(error.message).toBe('Slow down');
  });

  it('passes an ApiError through and wraps anything else as a 500', () => {
    const existing = new ApiError('Already mapped', 404);

    expect(toApiError(existing)).toBe(existing);
    expect(toApiError(new Error('boom')).status).toBe(500);
  });
});
