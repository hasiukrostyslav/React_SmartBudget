import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';

import {
  getTransactions,
  type SearchParams,
  type TransactionsResponse,
} from '@/services/apiTransactions';

const ALLOWED_KEYS = [
  'limit',
  'page',
  'categories',
  'types',
  'accounts',
  'sort',
  'order',
] as const satisfies readonly (keyof SearchParams)[];

function paramsFromSearch(searchParams: URLSearchParams): Partial<SearchParams> {
  const result: Partial<SearchParams> = {};
  for (const key of ALLOWED_KEYS) {
    const value = searchParams.get(key);
    if (value !== null) {
      // SearchParams in zod schema all default to string
      (result as Record<string, string>)[key] = value;
    }
  }
  return result;
}

export function useTransactions() {
  const [searchParams] = useSearchParams();
  const params = paramsFromSearch(searchParams);

  const { data, isPending, isFetching, error } = useQuery<TransactionsResponse>({
    queryKey: ['transactions', params],
    queryFn: () => getTransactions(params),
  });

  return {
    transactions: data?.transactions ?? [],
    transactionCount: data?.transactionCount ?? 0,
    isPending,
    isFetching,
    error,
  };
}
