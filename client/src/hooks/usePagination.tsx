import { useSearchParams } from 'react-router';

import { PAGE_SIZE_OPTIONS, PAGINATION_RANGE } from '@/lib/constants/constants';
import { createQueryString, getPaginationPattern } from '@/lib/utils/utils';

export function usePagination(totalCount: number) {
  const [searchParams] = useSearchParams();

  const limit = Number(searchParams.get('limit') || PAGE_SIZE_OPTIONS[0]);
  const currentPage = Number(searchParams.get('page') || 1);
  const pageCount = Math.ceil(totalCount / limit);

  const stack = Array.from(
    {
      length: pageCount > PAGINATION_RANGE ? PAGINATION_RANGE : pageCount,
    },
    (_, i) => {
      const paginationPattern = getPaginationPattern(pageCount, i, currentPage);
      return paginationPattern;
    },
  );

  const itemsRange = {
    min: currentPage === 1 ? 1 : limit * (currentPage - 1) + 1,
    max:
      currentPage === 1
        ? limit < totalCount
          ? limit
          : totalCount
        : limit * currentPage < totalCount
          ? limit * currentPage
          : totalCount,
  };

  const prevPageQuery = createQueryString(searchParams, [
    { name: 'page', value: currentPage - 1 },
  ]);
  const nextPageQuery = createQueryString(searchParams, [
    { name: 'page', value: currentPage + 1 },
  ]);

  return {
    pageCount,
    limit,
    itemsRange,
    currentPage,
    stack,
    prevPageQuery,
    nextPageQuery,
  };
}
