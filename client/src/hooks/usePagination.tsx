import { useSearchParams } from 'react-router';

import { PAGE_SIZE_OPTIONS, PAGINATION_RANGE } from '@/lib/constants/constants';
import { createQueryString, getPaginationPattern } from '@/lib/utils/utils';

export function usePagination(totalItems: number) {
  const [searchParams] = useSearchParams();

  const limit = Number(searchParams.get('limit') || PAGE_SIZE_OPTIONS[0]);
  const currentPage = Number(searchParams.get('page') || 1);
  const count = Math.ceil(totalItems / limit);

  const stack = Array.from(
    {
      length: count > PAGINATION_RANGE ? PAGINATION_RANGE : count,
    },
    (_, i) => {
      const paginationPattern = getPaginationPattern(count, i, currentPage);
      return paginationPattern;
    },
  );

  const prevPageQuery = createQueryString(searchParams, [
    { name: 'page', value: currentPage - 1 },
  ]);
  const nextPageQuery = createQueryString(searchParams, [
    { name: 'page', value: currentPage + 1 },
  ]);

  return {
    count,
    currentPage,
    stack,
    prevPageQuery,
    nextPageQuery,
  };
}
