import jwt from 'jsonwebtoken';
import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { app } from './app';
import { env } from './config/env';

// Routes that can be proven without a database: the pool is created lazily
// and none of these reach a query.

function accessCookie() {
  const token = jwt.sign(
    { sub: 'user-1', email: 't@example.com' },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: '5m',
    },
  );
  return `access_token=${token}`;
}

describe('app wiring', () => {
  it('returns JSON, not HTML, for an unmatched route', async () => {
    const res = await request(app).get('/api/does-not-exist');

    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(res.body).toEqual({
      message: 'Route not found: GET /api/does-not-exist',
    });
  });

  it('rejects a mutating request without a CSRF token as JSON with a code', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Cookie', accessCookie())
      .send({});

    expect(res.status).toBe(403);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(res.body).toEqual({
      message: 'invalid csrf token',
      code: 'EBADCSRFTOKEN',
    });
    expect(res.text).not.toContain('node_modules');
  });

  it('exempts signout from CSRF via the csrf config, not a path string', async () => {
    const res = await request(app).post('/api/auth/signout');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Logged out' });
  });

  it('returns 401 for a protected route without a token', async () => {
    const res = await request(app).get('/api/transactions');

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: 'Access token is missing' });
  });

  it('serves transactions at the top level, no longer under dashboard', async () => {
    const res = await request(app)
      .get('/api/dashboard/transactions')
      .set('Cookie', accessCookie());

    expect(res.status).toBe(404);
  });

  it('returns 400 naming the bad query parameter, before touching the database', async () => {
    const res = await request(app)
      .get('/api/transactions?limit=abc')
      .set('Cookie', accessCookie());

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/^Invalid query parameter "limit"/);
  });

  it('sets a request id on every response', async () => {
    const res = await request(app).get('/api/does-not-exist');

    expect(res.headers['x-request-id']).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('echoes an incoming request id so logs can be correlated across services', async () => {
    const res = await request(app)
      .get('/api/does-not-exist')
      .set('X-Request-Id', 'trace-abc-123');

    expect(res.headers['x-request-id']).toBe('trace-abc-123');
  });
});
