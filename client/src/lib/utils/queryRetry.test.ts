import { ApiError } from '@/services/apiError';
import { describe, expect, it } from 'vitest';

import { shouldRetryQuery } from './queryRetry';

describe('shouldRetryQuery', () => {
  it.each([400, 401, 403, 404, 429])('does not retry a %i', (status) => {
    expect(shouldRetryQuery(0, new ApiError('Client error', status))).toBe(
      false,
    );
  });

  it('retries network failures and server errors twice', () => {
    for (const status of [0, 500, 503]) {
      const error = new ApiError('Server error', status);
      expect(shouldRetryQuery(0, error)).toBe(true);
      expect(shouldRetryQuery(1, error)).toBe(true);
      expect(shouldRetryQuery(2, error)).toBe(false);
    }
  });

  it('retries errors that did not come from the API layer', () => {
    expect(shouldRetryQuery(0, new Error('boom'))).toBe(true);
  });
});
