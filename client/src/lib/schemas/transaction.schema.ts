import * as z from 'zod';

import {
  CURRENCIES,
  STATUSES,
  TRANSACTION_CATEGORIES,
  TRANSACTION_TYPES,
} from '../constants/enums';
import { TRANSACTION_SORT_OPTIONS } from '../constants/transactions';

export const TransactionSchema = z.object({
  transactionName: z
    .string()
    .min(1, { message: 'Transaction name is required.' })
    .trim(),
  transactionCategory: z.enum(TRANSACTION_CATEGORIES, {
    message: 'Category is required.',
  }),
  transactionType: z.enum(TRANSACTION_TYPES, {
    error: 'Transaction type is required.',
  }),
  paymentMethod: z.string().min(1, { message: 'Payment method is required.' }),
  currency: z.enum(CURRENCIES).default('UAH'),
  amount: z.coerce
    .number()
    .positive({ message: 'Amount must be a positive number.' }),
  description: z
    .string()
    .nullish()
    .transform((v) => v?.trim() || null)
    .optional(),
  status: z.enum(STATUSES).default('COMPLETED'),
  createdAt: z.date(),
});

export const CopyTransactionSchema = TransactionSchema.pick({
  createdAt: true,
  amount: true,
  currency: true,
  description: true,
});

export const SearchParamsSchema = z.object({
  limit: z.string().optional().default('10'),
  page: z.string().optional().default('1'),
  sort: z
    .enum(TRANSACTION_SORT_OPTIONS.map((opt) => opt.label))
    .optional()
    .default('date'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
  search: z.string().optional().default(''),
  category: z.string().optional().default(''),
  account: z.string().optional().default(''),
  date: z.string().optional().default(''),
  amount: z.string().optional().default(''),
  currency: z.string().optional().default(''),
  status: z.string().optional().default(''),
  type: z.string().optional().default(''),
});

export const FilterParamsSchema = SearchParamsSchema.pick({
  search: true,
  category: true,
  account: true,
  date: true,
  amount: true,
  currency: true,
  status: true,
  type: true,
});
