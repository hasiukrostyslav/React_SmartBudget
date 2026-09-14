import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { query } from '../../db/index';
import {
  closeTestDatabase,
  hasTestDatabase,
  resetTestDatabase,
} from '../../test/db';
import { SearchParamsSchema } from './transactions.schemas';
import {
  createTransaction,
  deleteTransactionById,
  findTransactionById,
  findTransactionsByUserId,
  updateTransactionById,
  updateTransactionsStatus,
} from './transactions.service';

const USER_A = 'user-a';
const USER_B = 'user-b';

const params = (raw: Record<string, string> = {}) =>
  SearchParamsSchema.parse(raw);

const base = {
  transactionName: 'Coffee at Cafe',
  transactionCategory: 'cafe',
  transactionType: 'Expenses',
  paymentMethod: 'Visa',
  currency: 'UAH',
  amount: 4.5,
  status: 'COMPLETED',
} as const;

const header = (category: string) =>
  category.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

// Runs only against TEST_DATABASE_URL (see vitest.config.ts).
describe.skipIf(!hasTestDatabase)('transactions.service', () => {
  beforeAll(async () => {
    await resetTestDatabase();
    await query(`INSERT INTO "users" (id, email) VALUES ($1, $2), ($3, $4);`, [
      USER_A,
      'a@example.com',
      USER_B,
      'b@example.com',
    ]);
  });
  afterAll(closeTestDatabase);

  it('maintains updated_at on every UPDATE path', async () => {
    const created = await createTransaction(USER_A, { ...base });
    const id = created.transactionId;
    // Force a known-stale value so the assertion is about the service's
    // write, not about clock resolution or the session timezone.
    const makeStale = () =>
      query(
        `UPDATE "transactions" SET updated_at = created_at - interval '1 day' WHERE transaction_id = $1;`,
        [id],
      );

    await makeStale();
    const stale = (await findTransactionById(id, USER_A))!;
    expect(new Date(stale.updatedAt) < new Date(stale.createdAt)).toBe(true);

    const edited = (await updateTransactionById(id, USER_A, { amount: 5 }))!;
    expect(edited.amount).toBe(5);
    expect(new Date(edited.updatedAt) >= new Date(edited.createdAt)).toBe(true);

    await makeStale();
    await updateTransactionsStatus(USER_A, {
      transactionIds: [id],
      status: 'PENDING',
    });
    const bulk = (await findTransactionById(id, USER_A))!;
    expect(bulk.status).toBe('PENDING');
    expect(new Date(bulk.updatedAt) >= new Date(bulk.createdAt)).toBe(true);
  });

  it('filters — including the spaced-enum categories — and counts track the filter', async () => {
    await createTransaction(USER_A, {
      ...base,
      transactionName: 'Exchange',
      transactionCategory: 'currency_exchange',
      amount: 100,
    });
    await createTransaction(USER_A, {
      ...base,
      transactionName: 'Salary',
      transactionCategory: 'income',
      transactionType: 'Income',
      amount: 1000,
    });

    const all = await findTransactionsByUserId(USER_A, params());
    const fx = await findTransactionsByUserId(
      USER_A,
      params({ category: 'currency_exchange' }),
    );
    const income = await findTransactionsByUserId(
      USER_A,
      params({ type: 'Income' }),
    );

    expect(fx.transactionCount).toBe(1);
    expect(fx.transactions[0].transactionCategory).toBe('currency_exchange');
    expect(income.transactionCount).toBe(1);
    expect(income.transactions[0].transactionType).toBe('Income');
    expect(all.transactionCount).toBeGreaterThan(fx.transactionCount);
  });

  it('search is case-insensitive and inert to SQL metacharacters', async () => {
    const hit = await findTransactionsByUserId(
      USER_A,
      params({ search: 'cAfE' }),
    );
    expect(hit.transactionCount).toBeGreaterThanOrEqual(1);
    for (const t of hit.transactions) {
      expect(
        `${t.transactionName} ${t.description ?? ''}`.toLowerCase(),
      ).toContain('cafe');
    }

    const injected = await findTransactionsByUserId(
      USER_A,
      params({ search: "%' OR 1=1 --" }),
    );
    expect(injected.transactionCount).toBe(0);
  });

  it('orders by category display header in SQL and pages without overlap', async () => {
    for (const cat of ['water', 'appliance', 'pet_care', 'books'] as const) {
      await createTransaction(USER_A, {
        ...base,
        transactionName: cat,
        transactionCategory: cat,
      });
    }

    const sorted = await findTransactionsByUserId(
      USER_A,
      params({ sort: 'category', order: 'asc', limit: '100' }),
    );
    const headers = sorted.transactions.map((t) =>
      header(t.transactionCategory),
    );
    expect([...headers].sort((a, b) => a.localeCompare(b))).toEqual(headers);

    const page = (n: string) =>
      findTransactionsByUserId(
        USER_A,
        params({ sort: 'category', order: 'asc', limit: '2', page: n }),
      );
    const [p1, p2] = await Promise.all([page('1'), page('2')]);
    const ids1 = p1.transactions.map((t) => t.transactionId);
    const ids2 = p2.transactions.map((t) => t.transactionId);
    expect(ids1.some((id) => ids2.includes(id))).toBe(false);
    expect(p1.transactionCount).toBe(sorted.transactionCount);
  });

  it('scopes every operation to the owning user', async () => {
    const mine = await createTransaction(USER_A, {
      ...base,
      transactionName: 'Private',
    });
    const id = mine.transactionId;

    expect(await findTransactionById(id, USER_B)).toBeNull();
    expect(await updateTransactionById(id, USER_B, { amount: 999 })).toBeNull();
    expect((await deleteTransactionById(id, USER_B)).deleted).toBe(0);
    expect(
      (await findTransactionsByUserId(USER_B, params())).transactionCount,
    ).toBe(0);
    expect((await findTransactionById(id, USER_A))!.amount).toBe(4.5);
  });
});
