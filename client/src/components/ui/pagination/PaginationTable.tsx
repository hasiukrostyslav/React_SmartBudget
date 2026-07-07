import { usePagination } from '@/hooks/usePagination';

import PaginationFilter from './PaginationFilter';
import PaginationPage from './PaginationPage';

interface PaginationTableProps {
  totalCount: number;
}

export default function PaginationTable({ totalCount }: PaginationTableProps) {
  const {
    pageCount,
    limit,
    itemsRange,
    currentPage,
    stack,
    prevPageQuery,
    nextPageQuery,
  } = usePagination(totalCount);

  return (
    <section className="flex items-center justify-between py-0.5">
      <PaginationFilter
        totalCount={totalCount}
        limit={limit}
        itemsRange={itemsRange}
      />

      <PaginationPage
        pageCount={pageCount}
        currentPage={currentPage}
        stack={stack}
        prevPageQuery={prevPageQuery}
        nextPageQuery={nextPageQuery}
      />
    </section>
  );
}
