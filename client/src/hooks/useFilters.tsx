import { useMemo } from 'react';

import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { z } from 'zod';

import { FilterParamsSchema } from '@/lib/schemas/transaction.schema';

type FilterKey = keyof z.infer<typeof FilterParamsSchema>;

const FILTER_KEYS = new Set<string>(Object.keys(FilterParamsSchema.shape));

export function useFilters() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const filters = useMemo(
    () =>
      Array.from(FILTER_KEYS).flatMap((key) =>
        searchParams
          .getAll(key)
          .filter((value) => value !== '')
          .map((value) => ({ key: key as FilterKey, value })),
      ),
    [searchParams],
  );

  const clearAll = () => {
    const newSearchParam = new URLSearchParams(searchParams.toString());
    FILTER_KEYS.forEach((filter) => newSearchParam.delete(filter));

    navigate(`${location.pathname}?${newSearchParam}`);
  };

  const clearFilter = ({ key, value }: { key: FilterKey; value: string }) => {
    const newSearchParam = new URLSearchParams(searchParams.toString());

    if (!newSearchParam.has(key)) return;

    if (
      newSearchParam.getAll(key).length === 1 &&
      newSearchParam.get(key) === value
    ) {
      newSearchParam.delete(key);
    } else {
      const values = newSearchParam.getAll(key).filter((el) => el !== value);
      newSearchParam.delete(key);
      values.forEach((el) => newSearchParam.append(key, el));
    }

    navigate(`${location.pathname}?${newSearchParam}`);
  };

  return { filters, clearAll, clearFilter };
}
