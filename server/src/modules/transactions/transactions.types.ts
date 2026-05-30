import type {
  TransactionCategory,
  TransactionStatus,
} from './schemas/transactions.schemas';

// The DB enum (created by the Next/Prisma schema) stores these four
// categories with spaces — see `@map("currency exchange")` etc. in
// next_smart_budget/prisma/schema.prisma. The client + API contract uses
// the underscore form, so we translate at the boundary.
const SPACED_CATEGORIES = new Set([
  'currency exchange',
  'mobile phone',
  'personal care',
  'pet care',
]);

export function categoryFromDb(value: string): TransactionCategory {
  return (
    SPACED_CATEGORIES.has(value) ? value.replace(/ /g, '_') : value
  ) as TransactionCategory;
}

export function categoryToDb(value: TransactionCategory): string {
  const spaced = value.replace(/_/g, ' ');
  return SPACED_CATEGORIES.has(spaced) ? spaced : value;
}

export interface TransactionRow {
  transaction_id: string;
  user_id: string;
  transaction_name: string;
  transaction_category: string;
  payment_method: string;
  transaction_type: 'Income' | 'Expenses';
  currency: string;
  amount: number;
  description: string | null;
  status: TransactionStatus;
  created_at: string | Date;
  updated_at: string | Date;
}

export interface TransactionDto {
  transactionId: string;
  userId: string;
  transactionName: string;
  transactionCategory: TransactionCategory;
  paymentMethod: string;
  transactionType: 'Income' | 'Expenses';
  currency: string;
  amount: number;
  description: string | null;
  status: TransactionStatus;
  createdAt: string;
  updatedAt: string;
}

export function mapTransactionRow(row: TransactionRow): TransactionDto {
  return {
    transactionId: row.transaction_id,
    userId: row.user_id,
    transactionName: row.transaction_name,
    transactionCategory: categoryFromDb(row.transaction_category),
    paymentMethod: row.payment_method,
    transactionType: row.transaction_type,
    currency: row.currency,
    amount: Number(row.amount),
    description: row.description,
    status: row.status,
    createdAt:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : row.created_at,
    updatedAt:
      row.updated_at instanceof Date
        ? row.updated_at.toISOString()
        : row.updated_at,
  };
}
