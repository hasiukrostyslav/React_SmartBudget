import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { createId } from '@paralleldrive/cuid2';

import type {
  BulkCategoryDto,
  BulkDeleteDto,
  BulkStatusDto,
  SearchParamsDto,
  TransactionCategory,
  TransactionCreateDto,
  TransactionUpdateDto,
} from './schemas/transactions.schemas';
import {
  categoryToDb,
  mapTransactionRow,
  type TransactionDto,
  type TransactionRow,
} from './transactions.types';

const PAGE_SIZE_DEFAULT = 10;

// Mirrors TRANSACTION_CATEGORIES_CONFIG[cat].text.header from the client —
// every header is Title Case of the underscore-replaced category name.
function categoryHeader(cat: string): string {
  return cat.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

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
    // Mirror next behaviour: expenses count as negative so "high amount" sorts
    // by displayed balance impact, not absolute value.
    return `(CASE WHEN transaction_type = 'Expenses' THEN -amount ELSE amount END) ${direction}`;
  }
  return `"${column}" ${direction}`;
}

@Injectable()
export class TransactionsService {
  constructor(@Inject('PG_POOL') private readonly pool: Pool) {}

  async findByUserId(userId: string, params: SearchParamsDto) {
    const limit = Math.max(1, Number(params.limit ?? PAGE_SIZE_DEFAULT));
    const page = Math.max(1, Number(params.page ?? 1));
    const skip = limit * (page - 1);
    const sortKey = params.sort ?? 'date';
    const order = params.order ?? 'desc';

    // Category sort matches next/lib/db/transactions.ts — alphabetical by
    // the display header (TRANSACTION_CATEGORIES_CONFIG[cat].text.header)
    // using localeCompare. Has to be done in JS because the DB enum's
    // declaration order puts the four @map'd spaced values at the end.
    if (sortKey === 'category') {
      const all = await this.pool.query<TransactionRow>(
        `SELECT * FROM "transactions" WHERE user_id = $1;`,
        [userId],
      );
      const rows = all.rows.map(mapTransactionRow);
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
      this.pool.query<TransactionRow>(listSql, [userId, limit, skip]),
      this.pool.query<{ count: number }>(countSql, [userId]),
    ]);

    return {
      transactions: listResult.rows.map(mapTransactionRow),
      transactionCount: countResult.rows[0]?.count ?? 0,
    };
  }

  async findById(id: string, userId: string): Promise<TransactionDto | null> {
    const result = await this.pool.query<TransactionRow>(
      `SELECT * FROM "transactions" WHERE transaction_id = $1 AND user_id = $2;`,
      [id, userId],
    );
    const row = result.rows[0];
    return row ? mapTransactionRow(row) : null;
  }

  async create(
    userId: string,
    dto: TransactionCreateDto,
  ): Promise<TransactionDto> {
    const transactionId = createId();
    const result = await this.pool.query<TransactionRow>(
      `INSERT INTO "transactions" (
        transaction_id, user_id, transaction_name, transaction_category,
        payment_method, transaction_type, currency, amount, description, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
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
      ],
    );
    return mapTransactionRow(result.rows[0]);
  }

  async update(
    id: string,
    userId: string,
    dto: TransactionUpdateDto,
  ): Promise<TransactionDto | null> {
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

    if (sets.length === 0) return this.findById(id, userId);

    values.push(id, userId);
    const result = await this.pool.query<TransactionRow>(
      `UPDATE "transactions" SET ${sets.join(', ')}
       WHERE transaction_id = $${values.length - 1} AND user_id = $${values.length}
       RETURNING *;`,
      values,
    );
    const row = result.rows[0];
    return row ? mapTransactionRow(row) : null;
  }

  async updateStatusMany(userId: string, dto: BulkStatusDto) {
    const result = await this.pool.query(
      `UPDATE "transactions" SET status = $1
       WHERE user_id = $2 AND transaction_id = ANY($3::text[]);`,
      [dto.status, userId, dto.transactionIds],
    );
    return { updated: result.rowCount ?? 0 };
  }

  async updateCategoryMany(userId: string, dto: BulkCategoryDto) {
    const result = await this.pool.query(
      `UPDATE "transactions" SET transaction_category = $1
       WHERE user_id = $2 AND transaction_id = ANY($3::text[]);`,
      [categoryToDb(dto.category), userId, dto.transactionIds],
    );
    return { updated: result.rowCount ?? 0 };
  }

  async deleteById(id: string, userId: string) {
    const result = await this.pool.query(
      `DELETE FROM "transactions" WHERE transaction_id = $1 AND user_id = $2;`,
      [id, userId],
    );
    return { deleted: result.rowCount ?? 0 };
  }

  async deleteMany(userId: string, dto: BulkDeleteDto) {
    const result = await this.pool.query(
      `DELETE FROM "transactions"
       WHERE user_id = $1 AND transaction_id = ANY($2::text[]);`,
      [userId, dto.transactionIds],
    );
    return { deleted: result.rowCount ?? 0 };
  }

  async deleteAll(userId: string) {
    const result = await this.pool.query(
      `DELETE FROM "transactions" WHERE user_id = $1;`,
      [userId],
    );
    return { deleted: result.rowCount ?? 0 };
  }
}
