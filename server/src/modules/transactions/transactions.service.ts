import { createId } from '@paralleldrive/cuid2';

import { query } from '../../db/index';
import {
  TRANSACTION_CATEGORIES,
  type BulkCategoryDto,
  type BulkDeleteDto,
  type BulkStatusDto,
  type SearchParamsDto,
  type TransactionCategory,
  type TransactionCreateDto,
  type TransactionUpdateDto,
} from './transactions.schemas';
import {
  categoryToDb,
  mapTransactionRow,
  type TransactionDto,
  type TransactionRow,
} from './transactions.types';

const PAGE_SIZE_DEFAULT = 10;

// Every UPDATE sets this. The column has an INSERT default and no trigger, so
// nothing else maintains it — before this, every edit left updated_at equal to
// created_at. Uses the same UTC wall-clock convention as toUtcTimestamp.
const SET_UPDATED_AT = `updated_at = (NOW() AT TIME ZONE 'UTC')`;

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

// The DB enum's declaration order puts the four @map'd spaced values at the
// end, which is neither the alphabetical order users see nor the client's enum
// order. Rank the categories once at module load and emit a CASE expression, so
// the database can order and paginate them itself. This replaces a branch that
// used to SELECT every row a user owned and sort it in memory.
const CATEGORY_RANK_SQL = (() => {
  const ranked = [...TRANSACTION_CATEGORIES].sort((a, b) =>
    categoryHeader(a).localeCompare(categoryHeader(b)),
  );
  // Values come from the hardcoded enum, never from user input.
  const whens = ranked
    .map((cat, index) => `WHEN '${categoryToDb(cat)}' THEN ${index}`)
    .join(' ');
  return `CASE transaction_category::text ${whens} ELSE ${ranked.length} END`;
})();

function buildOrderBy(sortKey: string, order: 'asc' | 'desc') {
  const column = SORT_COLUMN[sortKey] ?? 'created_at';
  const direction = order === 'asc' ? 'ASC' : 'DESC';

  if (column === 'amount') {
    // Signed amount: expenses count as negative so sorting matches the
    // displayed balance impact (mirrors next/lib/db/transactions.ts).
    return `(CASE WHEN transaction_type = 'Expenses' THEN -amount ELSE amount END) ${direction}`;
  }
  if (column === 'transaction_category') {
    return `${CATEGORY_RANK_SQL} ${direction}`;
  }
  return `"${column}" ${direction}`;
}

// --- P1-1 / P1-2: filters the API actually applies -------------------------

// Builds the shared WHERE clause for both the page query and the count query,
// so the reported total always matches the rows returned.
function buildWhere(userId: string, params: SearchParamsDto) {
  const clauses = ['user_id = $1'];
  const values: unknown[] = [userId];

  const addList = (column: string, list: string[]) => {
    if (list.length === 0) return;
    values.push(list);
    // ::text on the column so enum-typed columns compare against a text array.
    clauses.push(`${column}::text = ANY($${values.length}::text[])`);
  };

  if (params.search) {
    // Bound parameter, so the term is never interpolated into SQL.
    values.push(`%${params.search}%`);
    const i = values.length;
    clauses.push(`(transaction_name ILIKE $${i} OR description ILIKE $${i})`);
  }

  addList('transaction_category', params.category.map(categoryToDb));
  addList('transaction_type', params.type);
  addList('payment_method', params.account);
  addList('status', params.status);
  addList('currency', params.currency);

  return { where: clauses.join(' AND '), values };
}

export async function findTransactionsByUserId(
  userId: string,
  params: SearchParamsDto,
): Promise<{ transactions: TransactionDto[]; transactionCount: number }> {
  const limit = params.limit ?? PAGE_SIZE_DEFAULT;
  const page = params.page ?? 1;
  const skip = limit * (page - 1);

  const { where, values } = buildWhere(userId, params);
  const orderBy = buildOrderBy(params.sort ?? 'date', params.order ?? 'desc');

  const listSql = `
    SELECT * FROM "transactions"
    WHERE ${where}
    ORDER BY ${orderBy}
    LIMIT $${values.length + 1} OFFSET $${values.length + 2};
  `;
  const countSql = `SELECT COUNT(*)::int AS count FROM "transactions" WHERE ${where};`;

  const [listResult, countResult] = await Promise.all([
    query<TransactionRow>(listSql, [...values, limit, skip]),
    query<{ count: number }>(countSql, values),
  ]);

  return {
    transactions: listResult.rows.map((row) => mapTransactionRow(row)),
    transactionCount: countResult.rows[0]?.count ?? 0,
  };
}

export async function findTransactionById(
  id: string,
  userId: string,
): Promise<TransactionDto | null> {
  const result = await query<TransactionRow>(
    `SELECT * FROM "transactions" WHERE transaction_id = $1 AND user_id = $2;`,
    [id, userId],
  );
  const row = result.rows[0];
  return row ? mapTransactionRow(row) : null;
}

export async function createTransaction(
  userId: string,
  dto: TransactionCreateDto,
): Promise<TransactionDto> {
  const transactionId = createId();
  const result = await query<TransactionRow>(
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
    createdAt: 'created_at',
  };

  const sets: string[] = [];
  const values: unknown[] = [];

  for (const [field, value] of Object.entries(dto)) {
    if (value === undefined) continue;
    const column = columnByField[field];
    if (!column) continue;
    let columnValue = value;
    if (field === 'transactionCategory') {
      columnValue = categoryToDb(value as TransactionCategory);
    }
    // Same UTC wall-clock convention as createTransaction: a raw Date would be
    // serialised in the process's local timezone and shift the stored time.
    if (field === 'createdAt') {
      columnValue = toUtcTimestamp(value as Date);
    }
    values.push(columnValue);
    sets.push(`"${column}" = $${values.length}`);
  }

  if (sets.length === 0) return findTransactionById(id, userId);

  values.push(id, userId);
  const result = await query<TransactionRow>(
    `UPDATE "transactions" SET ${sets.join(', ')}, ${SET_UPDATED_AT}
     WHERE transaction_id = $${values.length - 1} AND user_id = $${values.length}
     RETURNING *;`,
    values,
  );

  const row = result.rows[0];
  return row ? mapTransactionRow(row) : null;
}

export async function updateTransactionsStatus(
  userId: string,
  dto: BulkStatusDto,
): Promise<{ updated: number }> {
  const result = await query(
    `UPDATE "transactions" SET status = $1, ${SET_UPDATED_AT}
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
    `UPDATE "transactions" SET transaction_category = $1, ${SET_UPDATED_AT}
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
  const result = await query(`DELETE FROM "transactions" WHERE user_id = $1;`, [
    userId,
  ]);
  return { deleted: result.rowCount ?? 0 };
}
