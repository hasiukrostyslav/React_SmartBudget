import { z } from 'zod';

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

export const TransactionFieldSchema = z.object({
  transactionName: z.string().trim().min(1, 'Transaction name is required.'),
  transactionCategory: z.enum(TRANSACTION_CATEGORIES, {
    message: 'Category is required.',
  }),
  transactionType: z.enum(TRANSACTION_TYPES, {
    error: 'Transaction type is required.',
  }),
  paymentMethod: z.string().min(1, 'Payment method is required.'),
  currency: z.enum(CURRENCIES),
  amount: z.number().positive('Amount must be a positive number.'),
  description: z.string().optional(),
  status: z.enum(STATUSES),
  createdAt: z.coerce.date().optional(),
});

export const TransactionCreateSchema = TransactionFieldSchema.extend({
  currency: z.enum(CURRENCIES).default('UAH'),
  status: z.enum(STATUSES).default('COMPLETED'),
});

export const TransactionUpdateSchema = TransactionFieldSchema.partial();

// A filter arrives as a comma-separated list ("cafe,car"). Empty and the legacy
// "all" sentinel both mean "no filter". Values are validated against the enum
// rather than dropped, so a bad value is a 400 instead of silently unfiltered
// results — which is how these params previously failed.
function filterList<T extends readonly [string, ...string[]]>(values: T) {
  return z
    .string()
    .optional()
    .transform((value) =>
      !value || value.trim() === '' || value.trim() === 'all'
        ? []
        : value
            .split(',')
            .map((entry) => entry.trim())
            .filter(Boolean),
    )
    .pipe(z.array(z.enum(values)));
}

// payment_method is free text, so there is no enum to check it against.
const freeTextList = z
  .string()
  .optional()
  .transform((value) =>
    !value || value.trim() === '' || value.trim() === 'all'
      ? []
      : value
          .split(',')
          .map((entry) => entry.trim())
          .filter(Boolean),
  );

export const SearchParamsSchema = z.object({
  // Coerced and bounded here so the service never sees NaN, 0 or a page size
  // large enough to be used as a denial-of-service lever.
  limit: z.coerce.number().int().min(1).max(100).default(10),
  page: z.coerce.number().int().min(1).default(1),
  sort: z.enum(sortLabels).optional().default('date'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
  search: z.string().trim().optional().default(''),
  category: filterList(TRANSACTION_CATEGORIES),
  type: filterList(TRANSACTION_TYPES),
  status: filterList(STATUSES),
  currency: filterList(CURRENCIES),
  account: freeTextList,
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
