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
    { expiresIn: '5m' },
  );
  return `access_token=${token}`;
}

// A CSRF token and every cookie it is bound to: the token cookie and the
// anonymous csrf-sid it was issued for.
async function csrfPair() {
  const res = await request(app).get('/api/auth/csrf-token');
  const setCookie = (res.headers['set-cookie'] ?? []) as string[];
  const cookie = setCookie.map((c) => c.split(';')[0]).join('; ');
  return { token: res.body.csrfToken as string, cookie };
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

  it('rejects a CSRF token presented with another browser id', async () => {
    const first = await csrfPair();
    const second = await csrfPair();
    const tokenCookie = first.cookie
      .split('; ')
      .find((c) => c.startsWith('psifi.x-csrf-token='));
    const otherSid = second.cookie
      .split('; ')
      .find((c) => c.startsWith('csrf-sid='));
    expect(tokenCookie).toBeDefined();
    expect(otherSid).toBeDefined();

    const res = await request(app)
      .post('/api/transactions')
      .set('Cookie', `${accessCookie()}; ${tokenCookie}; ${otherSid}`)
      .set('x-csrf-token', first.token)
      .send({});

    expect(res.status).toBe(403);
    expect(res.body.code).toBe('EBADCSRFTOKEN');
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

  it('returns per-field errors for an invalid body, through the error middleware', async () => {
    const { token, cookie } = await csrfPair();
    const res = await request(app)
      .post('/api/transactions')
      .set('Cookie', `${accessCookie()}; ${cookie}`)
      .set('x-csrf-token', token)
      .send({ amount: -1 });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation failed');
    expect(res.body.errors.transactionName).toBeDefined();
    expect(res.body.errors.amount).toBeDefined();
    expect(res.headers['x-request-id']).toBeDefined();
  });

  it('sets a request id on every response', async () => {
    const res = await request(app).get('/api/does-not-exist');

    expect(res.headers['x-request-id']).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('echoes a well-formed incoming request id', async () => {
    const res = await request(app)
      .get('/api/does-not-exist')
      .set('X-Request-Id', 'trace-abc-123');

    expect(res.headers['x-request-id']).toBe('trace-abc-123');
  });

  it('replaces a malformed incoming request id rather than echoing it', async () => {
    const res = await request(app)
      .get('/api/does-not-exist')
      .set('X-Request-Id', 'not ok: <script>' + 'x'.repeat(200));

    expect(res.headers['x-request-id']).toMatch(/^[0-9a-f-]{36}$/);
  });
});

describe('CORS', () => {
  it('lets the SPA read rate-limit and request-id headers cross-origin', async () => {
    const res = await request(app)
      .get('/api/does-not-exist')
      .set('Origin', 'http://localhost:5173');

    expect(res.headers['access-control-allow-origin']).toBe(
      'http://localhost:5173',
    );
    const exposed = String(
      res.headers['access-control-expose-headers'],
    ).toLowerCase();
    expect(exposed).toContain('ratelimit-reset');
    expect(exposed).toContain('x-request-id');
  });
});
