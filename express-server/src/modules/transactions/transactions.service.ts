import { createId } from '@paralleldrive/cuid2';

import { query } from '../../db/index';
import type {
  BulkCategoryDto,
  BulkDeleteDto,
  BulkStatusDto,
  SearchParamsDto,
  TransactionCategory,
  TransactionCreateDto,
  TransactionStatus,
  TransactionUpdateDto,
} from './transactions.schemas';
import {
  categoryToDb,
  mapTransactionRow,
  type TransactionDto,
  type TransactionRow,
} from './transactions.types';

const PAGE_SIZE_DEFAULT = 10;

// Format a Date as a UTC wall-clock string ("YYYY-MM-DD HH:mm:ss.SSS") for a
// `timestamp without time zone` column, so the stored value is UTC and matches
// Prisma/Next regardless of the server's local timezone.
function toUtcTimestamp(date: Date): string {
  return date.toISOString().replace('T', ' ').replace('Z', '');
}

// Mirrors TRANSACTION_CATEGORIES_CONFIG[cat].text.header from the client —
// every header is Title Case of the underscore-replaced category name. We
// reconstruct it here so the backend doesn't need to duplicate the config.
function categoryHeader(cat: string): string {
  return cat.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

// Mirrors TRANSACTION_SORT_FIELD_MAP on the client: maps the URL sort param
// to a real DB column. Keys MUST stay in sync with the client enum.
const SORT_COLUMN: Record<string, string> = {
  name: 'transaction_name',
  account: 'payment_method',
  date: 'created_at',
  amount: 'amount',
  note: 'description',
  status: 'status',
  category: 'transaction_category',
};

function buildOrderBy(sortKey: string, order: 'asc' | 'desc') {
  const column = SORT_COLUMN[sortKey] ?? 'created_at';
  const direction = order === 'asc' ? 'ASC' : 'DESC';

  if (column === 'amount') {
    // Signed amount: expenses count as negative so sorting matches the
    // displayed balance impact (mirrors next/lib/db/transactions.ts).
    return `(CASE WHEN transaction_type = 'Expenses' THEN -amount ELSE amount END) ${direction}`;
  }
  return `"${column}" ${direction}`;
}

export async function findTransactionsByUserId(
  userId: string,
  params: SearchParamsDto,
): Promise<{ transactions: TransactionDto[]; transactionCount: number }> {
  const limit = Math.max(1, Number(params.limit ?? PAGE_SIZE_DEFAULT));
  const page = Math.max(1, Number(params.page ?? 1));
  const skip = limit * (page - 1);
  const sortKey = params.sort ?? 'date';
  const order = params.order ?? 'desc';

  // Category sort matches next/lib/db/transactions.ts — alphabetical by the
  // display header (TRANSACTION_CATEGORIES_CONFIG[cat].text.header) using
  // localeCompare. Has to be done in JS because the DB enum's declaration
  // order puts the four @map'd spaced values (currency exchange / mobile
  // phone / personal care / pet care) at the end, which is neither the
  // alphabetical order users see nor the enum-array order on the client.
  if (sortKey === 'category') {
    const all = await query(
      `SELECT * FROM "transactions" WHERE user_id = $1;`,
      [userId],
    );
    const rows = all.rows.map((row: TransactionRow) => mapTransactionRow(row));
    rows.sort((a, b) => {
      const labelA = categoryHeader(a.transactionCategory);
      const labelB = categoryHeader(b.transactionCategory);
      return order === 'asc'
        ? labelA.localeCompare(labelB)
        : labelB.localeCompare(labelA);
    });
    return {
      transactions: rows.slice(skip, skip + limit),
      transactionCount: rows.length,
    };
  }

  const orderBy = buildOrderBy(sortKey, order);

  const listSql = `
    SELECT * FROM "transactions"
    WHERE user_id = $1
    ORDER BY ${orderBy}
    LIMIT $2 OFFSET $3;
  `;
  const countSql = `SELECT COUNT(*)::int AS count FROM "transactions" WHERE user_id = $1;`;

  const [listResult, countResult] = await Promise.all([
    query(listSql, [userId, limit, skip]),
    query(countSql, [userId]),
  ]);

  return {
    transactions: listResult.rows.map((row: TransactionRow) =>
      mapTransactionRow(row),
    ),
    transactionCount: countResult.rows[0]?.count ?? 0,
  };
}

export async function findTransactionById(
  id: string,
  userId: string,
): Promise<TransactionDto | null> {
  const result = await query(
    `SELECT * FROM "transactions" WHERE transaction_id = $1 AND user_id = $2;`,
    [id, userId],
  );
  const row = result.rows[0] as TransactionRow | undefined;
  return row ? mapTransactionRow(row) : null;
}

export async function createTransaction(
  userId: string,
  dto: TransactionCreateDto,
): Promise<TransactionDto> {
  const transactionId = createId();
  const result = await query(
    `INSERT INTO "transactions" (
      transaction_id, user_id, transaction_name, transaction_category,
      payment_method, transaction_type, currency, amount, description, status,
      created_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *;`,
    [
      transactionId,
      userId,
      dto.transactionName,
      categoryToDb(dto.transactionCategory),
      dto.paymentMethod,
      dto.transactionType,
      dto.currency,
      dto.amount,
      dto.description ?? null,
      dto.status,
      // Store the UTC wall-clock so the value matches Prisma/Next. Passing a
      // Date would let node-postgres serialize it in the process's local TZ,
      // writing a shifted value into this `timestamp without time zone` column.
      toUtcTimestamp(dto.createdAt ?? new Date()),
    ],
  );

  return mapTransactionRow(result.rows[0]);
}

export async function updateTransactionById(
  id: string,
  userId: string,
  dto: TransactionUpdateDto,
): Promise<TransactionDto | null> {
  // Map camelCase DTO keys to snake_case columns
  const columnByField: Record<string, string> = {
    transactionName: 'transaction_name',
    transactionCategory: 'transaction_category',
    paymentMethod: 'payment_method',
    transactionType: 'transaction_type',
    currency: 'currency',
    amount: 'amount',
    description: 'description',
    status: 'status',
  };

  const sets: string[] = [];
  const values: unknown[] = [];

  for (const [field, value] of Object.entries(dto)) {
    if (value === undefined) continue;
    const column = columnByField[field];
    if (!column) continue;
    values.push(
      field === 'transactionCategory'
        ? categoryToDb(value as TransactionCategory)
        : value,
    );
    sets.push(`"${column}" = $${values.length}`);
  }

  if (sets.length === 0) return findTransactionById(id, userId);

  values.push(id, userId);
  const result = await query(
    `UPDATE "transactions" SET ${sets.join(', ')}
     WHERE transaction_id = $${values.length - 1} AND user_id = $${values.length}
     RETURNING *;`,
    values,
  );

  const row = result.rows[0] as TransactionRow | undefined;
  return row ? mapTransactionRow(row) : null;
}

export async function updateTransactionsStatus(
  userId: string,
  dto: BulkStatusDto,
): Promise<{ updated: number }> {
  const result = await query(
    `UPDATE "transactions" SET status = $1
     WHERE user_id = $2 AND transaction_id = ANY($3::text[]);`,
    [dto.status, userId, dto.transactionIds],
  );
  return { updated: result.rowCount ?? 0 };
}

export async function updateTransactionsCategory(
  userId: string,
  dto: BulkCategoryDto,
): Promise<{ updated: number }> {
  const result = await query(
    `UPDATE "transactions" SET transaction_category = $1
     WHERE user_id = $2 AND transaction_id = ANY($3::text[]);`,
    [categoryToDb(dto.category), userId, dto.transactionIds],
  );
  return { updated: result.rowCount ?? 0 };
}

export async function deleteTransactionById(
  id: string,
  userId: string,
): Promise<{ deleted: number }> {
  const result = await query(
    `DELETE FROM "transactions" WHERE transaction_id = $1 AND user_id = $2;`,
    [id, userId],
  );
  return { deleted: result.rowCount ?? 0 };
}

export async function deleteTransactionsMany(
  userId: string,
  dto: BulkDeleteDto,
): Promise<{ deleted: number }> {
  const result = await query(
    `DELETE FROM "transactions"
     WHERE user_id = $1 AND transaction_id = ANY($2::text[]);`,
    [userId, dto.transactionIds],
  );
  return { deleted: result.rowCount ?? 0 };
}

export async function deleteAllTransactions(
  userId: string,
): Promise<{ deleted: number }> {
  const result = await query(
    `DELETE FROM "transactions" WHERE user_id = $1;`,
    [userId],
  );
  return { deleted: result.rowCount ?? 0 };
}

// Re-exported so callers can pass single status/category values without
// importing schemas separately.
export type { TransactionStatus, TransactionCategory };
