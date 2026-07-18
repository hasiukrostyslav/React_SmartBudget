import type { TransactionItem } from '@/types/types';

import {
  DEFAULT_LOCALE,
  PAGE_SIZE_OPTIONS,
  PAGINATION_RANGE,
} from '../constants/constants';

// Set border color of Input Component
export function setBorderColor({
  error,
  disabled,
}: {
  error: string | undefined;
  disabled: boolean | undefined;
}) {
  const styles = {
    default: 'border-slate-300 dark:border-slate-400',
    error: 'border-red-300 dark:border-red-400',
    disabled: 'border-slate-200 dark:border-slate-500',
  };
  if (error) return styles.error;
  if (disabled) return styles.disabled;
  return styles.default;
}

// Generate Search Params string
export function createQueryString(
  searchParams: URLSearchParams,
  query: {
    name: string;
    value: string | number;
  }[],
) {
  const slugQuery = query.map((q) => ({ ...q, value: toSlug(q.value) }));

  const params = new URLSearchParams(searchParams.toString());
  slugQuery.forEach((el) => params.set(el.name, el.value));

  if (query.some((q) => q.name !== 'page')) params.set('page', '1');

  return params.toString();
}

// Convert Search Params value with ' ' to -
export function toSlug(value: string | number) {
  if (typeof value === 'number') return String(value);
  return value.toLowerCase().replace(/\s+/g, '-');
}

// Convert Search Params value with - to ' '
export function fromSlug(slug: string | number) {
  if (typeof slug === 'number') return slug;
  return slug.replace(/-/g, ' ');
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

// For testing purpose
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Calculate sum of deleted balance
export function calcDeletedBalance(item: TransactionItem[]) {
  const grouped = Object.entries(
    Object.groupBy(item, ({ currency }) => currency),
  );

  return grouped.map(([currency, entries]) => {
    return {
      currency,
      total: (entries ?? []).reduce(
        (sum, item) =>
          sum +
          (item.transactionType === 'Income' ? item.amount : -item.amount),
        0,
      ),
    };
  });
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
