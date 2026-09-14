import { ApiError } from '@/services/apiError';
import type { UseFormSetError } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';

import { applyServerFieldErrors } from './formErrors';

type SignUpForm = { name: string; email: string; password: string };

describe('applyServerFieldErrors', () => {
  it('sets the first message on each rendered field and reports it applied', () => {
    const setError = vi.fn<UseFormSetError<SignUpForm>>();
    const error = new ApiError('Validation failed', 400, 'VALIDATION_ERROR', {
      email: ['Email is already registered.', 'A second message'],
      role: ['Not a field this form renders.'],
    });

    const applied = applyServerFieldErrors<SignUpForm>(error, setError, [
      'name',
      'email',
      'password',
    ]);

    expect(applied).toBe(true);
    expect(setError).toHaveBeenCalledTimes(1);
    expect(setError).toHaveBeenCalledWith('email', {
      type: 'server',
      message: 'Email is already registered.',
    });
  });

  it('reports nothing applied so the caller can fall back to a toast', () => {
    const setError = vi.fn<UseFormSetError<SignUpForm>>();
    const apply = (error: unknown) =>
      applyServerFieldErrors<SignUpForm>(error, setError, ['email']);

    expect(
      apply(new ApiError('Bad', 400, undefined, { role: ['Not rendered.'] })),
    ).toBe(false);
    expect(apply(new ApiError('Down', 503))).toBe(false);
    expect(apply(new Error('boom'))).toBe(false);
    expect(setError).not.toHaveBeenCalled();
  });
});
