import { describe, expect, it } from 'vitest';

import { TRANSACTION_CATEGORIES } from '@/lib/constants/enums';

import { SignInSchema, SignUpSchema } from './auth.schema';
import { TransactionSchema } from './transaction.schema';

const transaction = {
  transactionName: 'Coffee',
  transactionCategory: TRANSACTION_CATEGORIES[0],
  transactionType: 'Expenses',
  paymentMethod: 'Card',
  amount: '4.50',
  createdAt: new Date('2025-03-04T05:06:07Z'),
};

describe('TransactionSchema', () => {
  it('trims the name, coerces the amount and fills the defaults', () => {
    const result = TransactionSchema.parse({
      ...transaction,
      transactionName: '  Coffee  ',
      description: '   ',
    });

    expect(result).toMatchObject({
      transactionName: 'Coffee',
      amount: 4.5,
      currency: 'UAH',
      status: 'COMPLETED',
      description: null,
    });
  });

  it('rejects a name that is only whitespace, as the server does', () => {
    const result = TransactionSchema.safeParse({
      ...transaction,
      transactionName: '   ',
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.path)).toEqual([
      ['transactionName'],
    ]);
  });

  it('mirrors the API limits on free text', () => {
    const over = TransactionSchema.safeParse({
      ...transaction,
      transactionName: 'n'.repeat(101),
      paymentMethod: 'p'.repeat(51),
      description: 'd'.repeat(501),
    });
    const atLimit = TransactionSchema.safeParse({
      ...transaction,
      transactionName: 'n'.repeat(100),
      paymentMethod: 'p'.repeat(50),
      description: 'd'.repeat(500),
    });

    expect(
      over.error?.issues.map((issue) => String(issue.path[0])).sort(),
    ).toEqual(['description', 'paymentMethod', 'transactionName']);
    expect(atLimit.success).toBe(true);
  });

  it('rejects an amount that is not positive', () => {
    const result = TransactionSchema.safeParse({ ...transaction, amount: '0' });

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.path)).toEqual([
      ['amount'],
    ]);
  });
});

describe('auth schemas', () => {
  it('lets a password that predates the sign-up policy sign in', () => {
    const result = SignInSchema.safeParse({
      email: 'ann@example.com',
      password: 'short',
    });

    expect(result.success).toBe(true);
  });

  it('mirrors the API limits on name and email', () => {
    const result = SignUpSchema.safeParse({
      name: 'n'.repeat(101),
      email: `${'a'.repeat(243)}@example.com`,
      password: 'Passw0rd!',
    });

    expect(
      result.error?.issues.map((issue) => String(issue.path[0])).sort(),
    ).toEqual(['email', 'name']);
  });

  it('still applies the password policy on sign-up', () => {
    const result = SignUpSchema.safeParse({
      name: 'Ann',
      email: 'ann@example.com',
      password: 'password',
    });

    expect(result.success).toBe(false);
  });
});
