import * as z from 'zod';

import {
  CURRENCIES,
  STATUSES,
  TRANSACTION_CATEGORIES,
  TRANSACTION_TYPES,
} from '../constants/enums';
import { TRANSACTION_SORT_OPTIONS } from '../constants/transactions';

export const SignUpSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .trim(),
  email: z.email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Password should be at least 8 characters long.' })
    .regex(/[a-zA-Z]/, {
      message: 'Password should contain at least one letter.',
    })
    .regex(/[0-9]/, { message: 'Password should contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Password should contain at least one special character.',
    })
    .trim(),
});

export const SignInSchema = z.object({
  email: z.email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Password should be at least 8 characters long.' })
    .regex(/[a-zA-Z]/, {
      message: 'Password should contain at least one letter.',
    })
    .regex(/[0-9]/, { message: 'Password should contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Password should contain at least one special character.',
    })
    .trim(),
});

export const ForgotPasswordSchema = z.object({
  email: z.email({ message: 'Please enter a valid email.' }).trim(),
});

export const TransactionCreateSchema = z.object({
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
  description: z.string().optional(),
  status: z.enum(STATUSES).default('COMPLETED'),
  createdAt: z.date(),
});

export const SearchParamsSchema = z.object({
  limit: z.string().optional().default('10'),
  page: z.string().optional().default('1'),
  categories: z.string().optional().default('all'),
  types: z.string().optional().default('all'),
  accounts: z.string().optional().default('all'),
  sort: z
    .enum(TRANSACTION_SORT_OPTIONS.map((opt) => opt.label))
    .optional()
    .default('date'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});
