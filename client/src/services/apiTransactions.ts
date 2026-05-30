import { AxiosError } from 'axios';
import * as z from 'zod';
import { api } from './axios.config';
import type { SearchParamsSchema } from '@/lib/schemas/schema';
import type {
  Status,
  TransactionCategories,
} from '@/lib/constants/enums';
import type {
  TransactionCreateInput,
  TransactionItem,
  TransactionUpdate,
} from '@/types/types';

export type SearchParams = z.infer<typeof SearchParamsSchema>;

export interface TransactionsResponse {
  transactions: TransactionItem[];
  transactionCount: number;
}

function unwrap(err: unknown): never {
  if (err instanceof AxiosError) {
    throw new Error(
      err.response?.data?.message ?? err.message ?? 'Internal server error!',
    );
  }
  throw new Error('Internal server error!');
}

export async function getTransactions(
  params?: Partial<SearchParams>,
): Promise<TransactionsResponse> {
  try {
    const res = await api.get('/dashboard/transactions', { params });
    return res.data;
  } catch (error) {
    unwrap(error);
  }
}

export async function getTransaction(id: string): Promise<TransactionItem> {
  try {
    const res = await api.get(`/dashboard/transactions/${id}`);
    return res.data;
  } catch (error) {
    unwrap(error);
  }
}

export async function createTransaction(
  data: TransactionCreateInput,
): Promise<TransactionItem> {
  try {
    const res = await api.post('/dashboard/transactions', data);
    return res.data;
  } catch (error) {
    unwrap(error);
  }
}

export async function updateTransaction(
  id: string,
  data: TransactionUpdate,
): Promise<TransactionItem> {
  try {
    const res = await api.patch(`/dashboard/transactions/${id}`, data);
    return res.data;
  } catch (error) {
    unwrap(error);
  }
}

export async function updateTransactionsStatus(
  transactionIds: string[],
  status: Status,
): Promise<{ updated: number }> {
  try {
    const res = await api.patch('/dashboard/transactions/status', {
      transactionIds,
      status,
    });
    return res.data;
  } catch (error) {
    unwrap(error);
  }
}

export async function updateTransactionsCategory(
  transactionIds: string[],
  category: TransactionCategories,
): Promise<{ updated: number }> {
  try {
    const res = await api.patch('/dashboard/transactions/category', {
      transactionIds,
      category,
    });
    return res.data;
  } catch (error) {
    unwrap(error);
  }
}

export async function deleteTransaction(
  id: string,
): Promise<{ deleted: number }> {
  try {
    const res = await api.delete(`/dashboard/transactions/${id}`);
    return res.data;
  } catch (error) {
    unwrap(error);
  }
}

export async function deleteTransactions(
  transactionIds: string[],
): Promise<{ deleted: number }> {
  try {
    const res = await api.delete('/dashboard/transactions', {
      data: { transactionIds },
    });
    return res.data;
  } catch (error) {
    unwrap(error);
  }
}

export async function deleteAllTransactions(): Promise<{ deleted: number }> {
  try {
    const res = await api.delete('/dashboard/transactions/all');
    return res.data;
  } catch (error) {
    unwrap(error);
  }
}
