import jwt from 'jsonwebtoken';
import request, { type Response } from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '../../app';
import { query } from '../../db/index';
import {
  closeTestDatabase,
  hasTestDatabase,
  resetTestDatabase,
} from '../../test/db';

function cookieValue(res: Response, name: string): string | undefined {
  const setCookie = (res.headers['set-cookie'] ?? []) as string[];
  return setCookie
    .find((c) => c.startsWith(`${name}=`))
    ?.split(';')[0]
    .slice(name.length + 1);
}

async function csrf() {
  const res = await request(app).get('/api/auth/csrf-token');
  const token = cookieValue(res, 'psifi.x-csrf-token');
  const sid = cookieValue(res, 'csrf-sid');
  return {
    token: res.body.csrfToken as string,
    // The token is bound to the anonymous csrf-sid issued with it.
    cookie: `psifi.x-csrf-token=${token}; csrf-sid=${sid}`,
  };
}

const CREDS = {
  name: 'Flow User',
  email: 'flow@example.com',
  password: 'Correct-horse-1!',
};

// Runs only against TEST_DATABASE_URL (see vitest.config.ts).
describe.skipIf(!hasTestDatabase)('auth flow', () => {
  beforeAll(resetTestDatabase);
  afterAll(closeTestDatabase);

  it('signup → session → rotating refresh → duplicate → login → signout', async () => {
    const c = await csrf();
    const post = (path: string, extraCookie = '') =>
      request(app)
        .post(path)
        .set('Cookie', extraCookie ? `${c.cookie}; ${extraCookie}` : c.cookie)
        .set('x-csrf-token', c.token);

    const signup = await post('/api/auth/signup').send(CREDS);
    expect(signup.status).toBe(201);
    const access = cookieValue(signup, 'access_token');
    const refresh1 = cookieValue(signup, 'refresh_token');
    expect(access).toBeTruthy();
    expect(refresh1).toBeTruthy();

    const session = await request(app)
      .get('/api/auth/session')
      .set('Cookie', `access_token=${access}`);
    expect(session.status).toBe(200);
    expect(session.body.user.email).toBe(CREDS.email);

    // Rotation: a refresh must issue a NEW refresh token, distinguishable by jti.
    const refresh = await post(
      '/api/auth/refresh',
      `refresh_token=${refresh1}`,
    );
    expect(refresh.status).toBe(200);
    const refresh2 = cookieValue(refresh, 'refresh_token');
    expect(refresh2).toBeTruthy();
    expect(refresh2).not.toBe(refresh1);
    const jti = (t: string) => (jwt.decode(t) as { jti: string }).jti;
    expect(jti(refresh2!)).not.toBe(jti(refresh1!));
    expect(cookieValue(refresh, 'access_token')).toBeTruthy();

    const duplicate = await post('/api/auth/signup').send(CREDS);
    expect(duplicate.status).toBe(409);

    const wrong = await post('/api/auth/login').send({
      email: CREDS.email,
      password: 'not-it',
    });
    expect(wrong.status).toBe(401);
    expect(wrong.body).toEqual({ message: 'Invalid email or password!' });

    const unknown = await post('/api/auth/login').send({
      email: 'nobody@example.com',
      password: 'whatever',
    });
    expect(unknown.status).toBe(401);
    expect(unknown.body).toEqual(wrong.body);

    const login = await post('/api/auth/login').send({
      email: CREDS.email,
      password: CREDS.password,
    });
    expect(login.status).toBe(200);

    const signout = await request(app).post('/api/auth/signout');
    expect(signout.status).toBe(200);
    const cleared = (signout.headers['set-cookie'] ?? []) as string[];
    expect(cleared.some((h) => h.startsWith('access_token=;'))).toBe(true);
    expect(cleared.some((h) => h.startsWith('refresh_token=;'))).toBe(true);
  });

  it('treats an account with no password (OAuth-created) as a 401, not a 500', async () => {
    await query(
      `INSERT INTO "users" (id, email, name, password) VALUES ($1, $2, $3, NULL);`,
      ['oauth-1', 'oauth@example.com', 'OAuth User'],
    );
    const c = await csrf();

    const res = await request(app)
      .post('/api/auth/login')
      .set('Cookie', c.cookie)
      .set('x-csrf-token', c.token)
      .send({ email: 'oauth@example.com', password: 'anything' });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: 'Invalid email or password!' });
  });

  it('reports healthy against the database', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
