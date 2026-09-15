import jwt from 'jsonwebtoken';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// The service is mocked so these tests need no database: they assert on the
// body that reaches it after routing, authentication, CSRF and validation.
// That layer is where the P0 edit bugs lived, and the DB-backed service
// tests call the service directly, below it.
vi.mock('./transactions.service', () => ({
  createTransaction: vi.fn(async (_userId: string, dto: object) => ({
    transactionId: 't-new',
    ...dto,
  })),
  updateTransactionById: vi.fn(
    async (id: string, _userId: string, dto: object) => ({
      transactionId: id,
      ...dto,
    }),
  ),
  findTransactionsByUserId: vi.fn(),
  findTransactionById: vi.fn(),
  updateTransactionsStatus: vi.fn(),
  updateTransactionsCategory: vi.fn(),
  deleteTransactionById: vi.fn(),
  deleteTransactionsMany: vi.fn(),
  deleteAllTransactions: vi.fn(),
}));

import { app } from '../../app';
import { env } from '../../config/env';
import {
  createTransaction,
  updateTransactionById,
  updateTransactionsStatus,
} from './transactions.service';

function accessCookie() {
  const token = jwt.sign(
    { sub: 'user-1', email: 't@example.com' },
    env.JWT_ACCESS_SECRET,
    { expiresIn: '5m' },
  );
  return `access_token=${token}`;
}

// Every cookie the CSRF endpoint sets, so the token is sent with whatever it
// is bound to.
async function csrf() {
  const res = await request(app).get('/api/auth/csrf-token');
  const setCookie = (res.headers['set-cookie'] ?? []) as string[];
  const cookies = setCookie.map((c) => c.split(';')[0]).join('; ');
  return { token: res.body.csrfToken as string, cookies };
}

async function send(method: 'post' | 'patch', path: string, body: object) {
  const { token, cookies } = await csrf();
  return request(app)
    [method](path)
    .set('Cookie', `${accessCookie()}; ${cookies}`)
    .set('x-csrf-token', token)
    .send(body);
}

const validTransaction = {
  transactionName: 'Coffee',
  transactionCategory: 'cafe',
  transactionType: 'Expenses',
  paymentMethod: 'Card',
  amount: 4.5,
};

describe('transaction routes: what validation passes to the service', () => {
  beforeEach(() => {
    vi.mocked(createTransaction).mockClear();
    vi.mocked(updateTransactionById).mockClear();
    vi.mocked(updateTransactionsStatus).mockClear();
  });

  it('POST fills currency and status defaults and accepts an empty note', async () => {
    const res = await send('post', '/api/transactions', {
      ...validTransaction,
      description: null,
    });

    expect(res.status).toBe(201);
    const [userId, dto] = vi.mocked(createTransaction).mock.calls[0];
    expect(userId).toBe('user-1');
    expect(dto).toMatchObject({
      currency: 'UAH',
      status: 'COMPLETED',
      description: null,
    });
  });

  it('PATCH passes through only the fields that were sent (X-P0-1)', async () => {
    const res = await send('patch', '/api/transactions/t-1', {
      transactionName: 'Renamed',
    });

    expect(res.status).toBe(200);
    const [id, userId, dto] = vi.mocked(updateTransactionById).mock.calls[0];
    expect(id).toBe('t-1');
    expect(userId).toBe('user-1');
    expect(dto).toEqual({ transactionName: 'Renamed' });
  });

  it('PATCH delivers a date edit to the service as a Date (X-P0-3)', async () => {
    const res = await send('patch', '/api/transactions/t-1', {
      createdAt: '2025-03-04T05:06:07.000Z',
    });

    expect(res.status).toBe(200);
    const [, , dto] = vi.mocked(updateTransactionById).mock.calls[0];
    expect(Object.keys(dto)).toEqual(['createdAt']);
    expect(dto.createdAt).toBeInstanceOf(Date);
    expect(dto.createdAt?.toISOString()).toBe('2025-03-04T05:06:07.000Z');
  });

  it('rejects an invalid body with field errors before reaching the service', async () => {
    const res = await send('patch', '/api/transactions/t-1', { amount: -1 });

    expect(res.status).toBe(400);
    expect(res.body.errors.amount).toBeDefined();
    expect(updateTransactionById).not.toHaveBeenCalled();
  });

  it('accepts free text up to its limit (S-P3-1)', async () => {
    const res = await send('post', '/api/transactions', {
      ...validTransaction,
      transactionName: 'n'.repeat(100),
      paymentMethod: 'p'.repeat(50),
      description: 'd'.repeat(500),
    });

    expect(res.status).toBe(201);
  });

  it('rejects free text over its limit before reaching the service (S-P3-1)', async () => {
    const res = await send('post', '/api/transactions', {
      ...validTransaction,
      transactionName: 'n'.repeat(101),
      paymentMethod: 'p'.repeat(51),
      description: 'd'.repeat(501),
    });

    expect(res.status).toBe(400);
    expect(Object.keys(res.body.errors).sort()).toEqual([
      'description',
      'paymentMethod',
      'transactionName',
    ]);
    expect(createTransaction).not.toHaveBeenCalled();
  });

  it('rejects a bulk update of more than 100 ids (S-P3-1)', async () => {
    const transactionIds = Array.from({ length: 101 }, (_, i) => `t-${i}`);
    const res = await send('patch', '/api/transactions/status', {
      transactionIds,
      status: 'COMPLETED',
    });

    expect(res.status).toBe(400);
    expect(res.body.errors.transactionIds).toBeDefined();
    expect(updateTransactionsStatus).not.toHaveBeenCalled();
  });
});
