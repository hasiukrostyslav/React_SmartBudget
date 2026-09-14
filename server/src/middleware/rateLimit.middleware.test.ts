import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { authLimiter } from './rateLimit.middleware';

// The limiter is exercised on a throwaway app so no database is involved: the
// route fails or succeeds purely on the request body.
function appWithAuthLimiter() {
  const app = express();
  app.use(express.json());
  app.post('/login', authLimiter, (req, res) => {
    res.status(req.body.ok ? 200 : 401).json({});
  });
  return app;
}

describe('authLimiter', () => {
  it('counts only failed attempts and trips on the 11th', async () => {
    const app = appWithAuthLimiter();

    // Successful requests must not consume the budget.
    for (let i = 0; i < 3; i++) {
      expect(
        (await request(app).post('/login').send({ ok: true })).status,
      ).toBe(200);
    }

    for (let i = 1; i <= 10; i++) {
      const res = await request(app).post('/login').send({ ok: false });
      expect(res.status, `failed attempt ${i}`).toBe(401);
    }

    const blocked = await request(app).post('/login').send({ ok: false });
    expect(blocked.status).toBe(429);
    expect(blocked.body).toEqual({
      message: 'Too many attempts. Please try again in 15 minutes.',
    });
    expect(blocked.headers['ratelimit-remaining']).toBe('0');
  });
});
