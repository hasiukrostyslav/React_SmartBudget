import * as z from 'zod';

export const TRANSACTION_TYPES = ['Income', 'Expenses'] as const;
export const STATUSES = ['COMPLETED', 'FAILED', 'PENDING', 'CANCELED'] as const;
export const CURRENCIES = ['UAH', 'USD', 'EUR', 'PLN', 'HUF', 'GBP'] as const;
export const TRANSACTION_CATEGORIES = [
  'income',
  'investments',
  'prize',
  'advertisement',
  'appliance',
  'books',
  'cafe',
  'car',
  'clothes',
  'currency_exchange',
  'delivery',
  'donations',
  'electricity',
  'entertainment',
  'flowers',
  'gas',
  'groceries',
  'healthcare',
  'insurance',
  'internet',
  'jewelry',
  'loan',
  'mobile_phone',
  'movies',
  'others',
  'personal_care',
  'pet_care',
  'repair',
  'sport',
  'taxes',
  'taxi',
  'transfer',
  'travel',
  'utilities',
  'water',
] as const;

const sortLabels = [
  'name',
  'category',
  'account',
  'date',
  'amount',
  'note',
  'status',
] as const;

export const TransactionCreateSchema = z.object({
  transactionName: z.string().trim().min(1, 'Transaction name is required.'),
  transactionCategory: z.enum(TRANSACTION_CATEGORIES, {
    message: 'Category is required.',
  }),
  transactionType: z.enum(TRANSACTION_TYPES),
  paymentMethod: z.string().min(1, 'Payment method is required.'),
  currency: z.enum(CURRENCIES).default('UAH'),
  amount: z.number().positive('Amount must be a positive number.'),
  description: z.string().optional(),
  status: z.enum(STATUSES).default('COMPLETED'),
});

export const TransactionUpdateSchema = TransactionCreateSchema.partial();

export const SearchParamsSchema = z.object({
  limit: z.string().optional().default('10'),
  page: z.string().optional().default('1'),
  categories: z.string().optional().default('all'),
  types: z.string().optional().default('all'),
  accounts: z.string().optional().default('all'),
  sort: z.enum(sortLabels).optional().default('date'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const BulkStatusSchema = z.object({
  transactionIds: z.array(z.string()).min(1),
  status: z.enum(STATUSES),
});

export const BulkCategorySchema = z.object({
  transactionIds: z.array(z.string()).min(1),
  category: z.enum(TRANSACTION_CATEGORIES),
});

export const BulkDeleteSchema = z.object({
  transactionIds: z.array(z.string()).min(1),
});

export type TransactionCreateDto = z.infer<typeof TransactionCreateSchema>;
export type TransactionUpdateDto = z.infer<typeof TransactionUpdateSchema>;
export type SearchParamsDto = z.infer<typeof SearchParamsSchema>;
export type BulkStatusDto = z.infer<typeof BulkStatusSchema>;
export type BulkCategoryDto = z.infer<typeof BulkCategorySchema>;
export type BulkDeleteDto = z.infer<typeof BulkDeleteSchema>;

export type TransactionStatus = (typeof STATUSES)[number];
export type TransactionCategory = (typeof TRANSACTION_CATEGORIES)[number];
