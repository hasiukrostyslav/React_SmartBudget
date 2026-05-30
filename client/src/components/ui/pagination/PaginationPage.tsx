import { useLocation, useSearchParams } from 'react-router';

import { createQueryString } from '@/lib/utils/utils';
import { usePagination } from '@/hooks/usePagination';

import PaginationButton from './PaginationButton';
import PaginationSkip from './PaginationSkip';

interface PaginationPageProps {
  totalCount: number;
}

export default function PaginationPage({ totalCount }: PaginationPageProps) {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { count, currentPage, stack, prevPageQuery, nextPageQuery } =
    usePagination(totalCount);

  return (
    <div className="flex items-center gap-2">
      <PaginationButton
        href={`${location.pathname}?${prevPageQuery}`}
        page="prev"
        disable={count === 1 || currentPage === 1}
      />

      {stack.map((page, i) =>
        page ? (
          <PaginationButton
            key={page}
            page={page}
            href={`${location.pathname}?${createQueryString(searchParams, [{ name: 'page', value: page }])}`}
            active={page === currentPage}
          />
        ) : (
          <PaginationSkip key={`${i}-skip`} />
        ),
      )}
      <PaginationButton
        href={`${location.pathname}?${nextPageQuery}`}
        page="next"
        disable={count === 1 || currentPage === count}
      />
    </div>
  );
}
