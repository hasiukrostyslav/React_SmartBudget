import { useLocation, useSearchParams } from 'react-router';

import { createQueryString } from '@/lib/utils/utils';

import PaginationButton from './PaginationButton';
import PaginationSkip from './PaginationSkip';

interface PaginationPageProps {
  pageCount: number;
  currentPage: number;
  stack: (number | null | undefined)[];
  prevPageQuery: string;
  nextPageQuery: string;
}

export default function PaginationPage({
  pageCount,
  currentPage,
  stack,
  prevPageQuery,
  nextPageQuery,
}: PaginationPageProps) {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  return (
    <div className="flex items-center gap-2">
      <PaginationButton
        href={`${location.pathname}?${prevPageQuery}`}
        page="prev"
        disabled={pageCount === 1 || currentPage === 1}
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
        disabled={pageCount === 1 || currentPage === pageCount}
      />
    </div>
  );
}
