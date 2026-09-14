import { describe, expect, it } from 'vitest';

import type { TransactionItem } from '@/types/types';

import { calcDeletedBalance } from './utils';

function transaction(
  fields: Pick<TransactionItem, 'currency' | 'transactionType' | 'amount'>,
) {
  return { ...fields } as TransactionItem;
}

describe('calcDeletedBalance', () => {
  it('nets income against expenses per currency, in first-seen order', () => {
    const balance = calcDeletedBalance([
      transaction({ currency: 'USD', transactionType: 'Expenses', amount: 10 }),
      transaction({ currency: 'UAH', transactionType: 'Income', amount: 100 }),
      transaction({ currency: 'USD', transactionType: 'Income', amount: 25 }),
    ]);

    expect(balance).toEqual([
      { currency: 'USD', total: 15 },
      { currency: 'UAH', total: 100 },
    ]);
  });

  it('returns no rows for no transactions', () => {
    expect(calcDeletedBalance([])).toEqual([]);
  });
});
