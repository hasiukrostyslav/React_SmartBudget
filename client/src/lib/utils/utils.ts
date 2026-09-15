import type { TransactionItem } from '@/types/types';

import {
  DEFAULT_LOCALE,
  PAGE_SIZE_OPTIONS,
  PAGINATION_RANGE,
} from '../constants/constants';

export function hasActiveFilters(
  params: Record<string, unknown> | undefined,
  filterKeys: readonly string[],
) {
  if (!params) return false;
  return filterKeys.some((key) => Boolean(params[key]));
}

// Generate Search Params string
export function createQueryString(
  searchParams: URLSearchParams,
  query: {
    param: string;
    value: string | number;
  }[],
) {
  const params = new URLSearchParams(searchParams.toString());
  query.forEach((el) =>
    el.value === ''
      ? params.delete(el.param)
      : params.set(el.param, String(el.value)),
  );

  if (query.find((q) => q.param !== 'page')) params.set('page', '1');

  params.sort();

  return params.toString();
}

// Select filter options for list size
export function getPageSizeOption(totalCount: number) {
  const options = [...PAGE_SIZE_OPTIONS];
  const index = options.findIndex((count) => count > totalCount);

  if (index === -1) return options;

  return options.slice(0, index + 1);
}

// Generate pagination buttons pattern
export function getPaginationPattern(
  count: number,
  index: number,
  currentPage: number,
) {
  const boundary = Math.ceil(PAGINATION_RANGE / 2);

  if (count <= PAGINATION_RANGE) return index + 1;
  if (count > PAGINATION_RANGE) {
    if (currentPage <= boundary) {
      return index < boundary ? index + 1 : index === boundary ? null : count;
    }
    if (currentPage >= count - boundary + 1) {
      return index === 0
        ? 1
        : index === 1
          ? null
          : count - boundary + index - 1;
    }

    return index === 0
      ? 1
      : index === PAGINATION_RANGE - 1
        ? count
        : index === boundary - 1
          ? currentPage
          : null;
  }
}

// Net balance change per currency if these transactions are deleted, in the
// order each currency first appears. A Map instead of Object.groupBy: that is
// ES2024, missing before Safari 17.4, and the build doesn't polyfill it.
export function calcDeletedBalance(items: TransactionItem[]) {
  const totals = new Map<string, number>();

  for (const item of items) {
    const signed =
      item.transactionType === 'Income' ? item.amount : -item.amount;
    totals.set(item.currency, (totals.get(item.currency) ?? 0) + signed);
  }

  return [...totals].map(([currency, total]) => ({ currency, total }));
}

// Keep only the fields react-hook-form flagged as modified
export function getDirtyValues<T extends object>(
  values: T,
  dirtyFields: Partial<Record<keyof T, unknown>>,
): Partial<T> {
  return (Object.keys(dirtyFields) as (keyof T)[])
    .filter((key) => dirtyFields[key])
    .reduce<Partial<T>>((acc, key) => {
      acc[key] = values[key];
      return acc;
    }, {});
}

// Format amount
export function getFormattedAmount(amount: number) {
  return new Intl.NumberFormat(DEFAULT_LOCALE, {
    minimumFractionDigits: 2,
  }).format(amount);
}
