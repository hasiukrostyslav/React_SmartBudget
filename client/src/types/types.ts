import type {
  Currency,
  Status,
  TransactionCategories,
  TransactionType,
} from '@/lib/constants/enums';
import { icons } from '@/lib/constants/icons';

export type IconName = (typeof icons)[number]['role'];

export interface TransactionItem {
  // ISO 8601 strings: JSON has no date type, so this is what the API sends.
  createdAt: string;
  updatedAt: string;
  userId: string;
  transactionId: string;
  transactionName: string;
  transactionCategory: TransactionCategories;
  paymentMethod: string;
  transactionType: TransactionType;
  currency: Currency;
  amount: number;
  description?: string | null;
  status: Status;
}

// Request payloads. Forms hold a Date, which axios serialises to ISO.
export type CreateTransactionData = Omit<
  TransactionItem,
  'createdAt' | 'updatedAt' | 'userId' | 'transactionId'
> & { createdAt: Date };
export type EditTransactionData = Partial<CreateTransactionData>;

export type ItemType =
  | 'transaction'
  | 'payment'
  | 'card'
  | 'saving'
  | 'loan'
  | 'deposit';

export interface SelectOption {
  value: string | number;
  label: string;
  description?: string;
  icon?: IconName;
  symbol?: string;
  color?: string;
}
