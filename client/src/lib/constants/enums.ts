export const TRANSACTION_TYPES = ['Income', 'Expenses'] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export const STATUSES = ['COMPLETED', 'FAILED', 'PENDING', 'CANCELED'] as const;
export type Status = (typeof STATUSES)[number];

export const CURRENCIES = ['UAH', 'USD', 'EUR', 'PLN', 'HUF', 'GBP'] as const;
export type Currency = (typeof CURRENCIES)[number];

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
export type TransactionCategories = (typeof TRANSACTION_CATEGORIES)[number];
