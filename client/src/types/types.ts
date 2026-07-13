import type z from 'zod';

import type {
  Currency,
  Status,
  TransactionCategories,
  TransactionType,
} from '@/lib/constants/enums';
import { icons } from '@/lib/constants/icons';
import type { SignInSchema, SignUpSchema } from '@/lib/schemas/schema';

// Icon names
export type IconName = (typeof icons)[number]['role'];

// Auth input with icons types
export interface InputIcons {
  name: Extract<IconName, 'name'>;
  email: Extract<IconName, 'email'>;
  password: Extract<IconName, 'password'>;
}

export type LoginFormInputs = z.infer<typeof SignInSchema>;
export type SignUpFormInputs = z.infer<typeof SignUpSchema>;

export interface TransactionItem {
  createdAt: string | Date;
  updatedAt: string | Date;
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

export type TransactionCreateInput = Omit<
  TransactionItem,
  'updatedAt' | 'userId' | 'transactionId'
>;
export type TransactionUpdate = Partial<
  Omit<TransactionItem, 'updatedAt' | 'userId' | 'transactionId'>
>;

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
