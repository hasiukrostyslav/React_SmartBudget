import {
  createTransaction,
  deleteAllTransactions,
  deleteTransaction,
  deleteTransactions,
  editTransaction,
  updateTransactionsCategory,
  updateTransactionsStatus,
} from '@/services/apiTransactions';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CreateTransactionData, EditTransactionData } from '@/types/types';

import type { Status, TransactionCategories } from '@/lib/constants/enums';

const TRANSACTIONS_KEY = ['transactions'];

function useInvalidateTransactions() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY });
}

export function useCreateTransaction() {
  const invalidate = useInvalidateTransactions();

  return useMutation({
    mutationFn: (data: CreateTransactionData) => createTransaction(data),
    onSuccess: invalidate,
  });
}

export function useEditTransaction() {
  const invalidate = useInvalidateTransactions();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EditTransactionData }) =>
      editTransaction(id, data),
    onSuccess: invalidate,
  });
}

export function useDeleteTransaction() {
  const invalidate = useInvalidateTransactions();

  return useMutation({
    mutationFn: (id: string) => deleteTransaction(id),
    onSuccess: invalidate,
  });
}

export function useDeleteManyTransactions() {
  const invalidate = useInvalidateTransactions();

  return useMutation({
    mutationFn: (ids: string[]) => deleteTransactions(ids),
    onSuccess: invalidate,
  });
}

export function useDeleteAllTransactions() {
  const invalidate = useInvalidateTransactions();

  return useMutation({
    mutationFn: () => deleteAllTransactions(),
    onSuccess: invalidate,
  });
}

export function useChangeTransactionStatus() {
  const invalidate = useInvalidateTransactions();

  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: Status }) =>
      updateTransactionsStatus(ids, status),
    onSuccess: invalidate,
  });
}

export function useChangeTransactionCategory() {
  const invalidate = useInvalidateTransactions();

  return useMutation({
    mutationFn: ({
      ids,
      category,
    }: {
      ids: string[];
      category: TransactionCategories;
    }) => updateTransactionsCategory(ids, category),
    onSuccess: invalidate,
  });
}
