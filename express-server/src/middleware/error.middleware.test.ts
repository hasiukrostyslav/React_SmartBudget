import type { Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';

import { AppError } from '../lib/AppError';
import { errorHandler } from './error.middleware';

function run(err: unknown) {
  const res = {
    headersSent: false,
    statusCode: 0,
    body: undefined as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(body: unknown) {
      this.body = body;
      return this;
    },
  };
  const req = { log: { error: vi.fn() } } as unknown as Request;
  const next = vi.fn();

  errorHandler(err, req, res as unknown as Response, next);

  return { status: res.statusCode, body: res.body, next, log: req.log };
}

describe('errorHandler', () => {
  it('renders an AppError with its status and message', () => {
    const { status, body } = run(new AppError(404, 'Transaction not found'));

    expect(status).toBe(404);
    expect(body).toEqual({ message: 'Transaction not found' });
  });

  it('renders per-field errors on a validation AppError', () => {
    const { status, body } = run(
      new AppError(400, 'Validation failed', {
        errors: { email: ['Invalid email format'] },
      }),
    );

    expect(status).toBe(400);
    expect(body).toEqual({
      message: 'Validation failed',
      errors: { email: ['Invalid email format'] },
    });
  });

  it('passes through http-errors shapes such as the csrf failure', () => {
    const err = Object.assign(new Error('invalid csrf token'), {
      statusCode: 403,
      code: 'EBADCSRFTOKEN',
    });

    const { status, body } = run(err);

    expect(status).toBe(403);
    expect(body).toEqual({
      message: 'invalid csrf token',
      code: 'EBADCSRFTOKEN',
    });
  });

  it('never sends a 5xx message or a system error code to the client', () => {
    const err = Object.assign(
      new Error('connect ECONNREFUSED 10.0.0.5:5432 password=hunter2'),
      { code: 'ECONNREFUSED' },
    );

    const { status, body, log } = run(err);

    expect(status).toBe(500);
    expect(body).toEqual({ message: 'Internal server error' });
    expect(JSON.stringify(body)).not.toContain('hunter2');
    expect(log.error).toHaveBeenCalledOnce();
  });

  it('treats a non-error throw and an out-of-range status as 500', () => {
    expect(run('something broke').status).toBe(500);
    expect(run({ status: 999, message: 'nope' }).status).toBe(500);
    expect(run(null).status).toBe(500);
  });

  it('defers to Express once headers have been sent', () => {
    const res = {
      headersSent: true,
      status: vi.fn(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();
    const err = new AppError(400, 'late');

    errorHandler(err, {} as Request, res, next);

    expect(next).toHaveBeenCalledWith(err);
    expect(res.status).not.toHaveBeenCalled();
  });
});
