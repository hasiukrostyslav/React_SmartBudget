import { readFileSync } from 'fs';
import path from 'path';

import { describe, expect, it } from 'vitest';

import {
  CURRENCIES,
  STATUSES,
  TRANSACTION_CATEGORIES,
  TRANSACTION_TYPES,
} from './modules/transactions/transactions.schemas';

// The client declares these enums again in its own source; the two apps share
// no package. This test keeps them from drifting apart by reading the client
// file as text and comparing the literal values. Order is not part of the
// contract, so the lists are compared sorted.
const CLIENT_ENUMS = path.resolve(
  __dirname,
  '../../client/src/lib/constants/enums.ts',
);

function clientList(source: string, name: string): string[] {
  const match = source.match(
    new RegExp(`export const ${name}\\s*=\\s*\\[([\\s\\S]*?)\\]`),
  );
  if (!match) throw new Error(`${name} not found in ${CLIENT_ENUMS}`);
  return [...match[1].matchAll(/'([^']+)'/g)].map((m) => m[1]).sort();
}

describe('client/server enum contract', () => {
  const source = readFileSync(CLIENT_ENUMS, 'utf8');

  it.each([
    ['TRANSACTION_CATEGORIES', TRANSACTION_CATEGORIES],
    ['STATUSES', STATUSES],
    ['CURRENCIES', CURRENCIES],
    ['TRANSACTION_TYPES', TRANSACTION_TYPES],
  ] as const)('%s matches the client', (name, serverValues) => {
    expect(clientList(source, name)).toEqual([...serverValues].sort());
  });
});
