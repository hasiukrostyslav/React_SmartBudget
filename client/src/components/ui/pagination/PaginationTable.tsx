import PaginationFilter from './PaginationFilter';
import PaginationPage from './PaginationPage';

interface PaginationTableProps {
  totalCount: number;
}

export default function PaginationTable({ totalCount }: PaginationTableProps) {
  return (
    <section className="flex items-center justify-between px-1 py-1">
      <PaginationFilter totalCount={totalCount} />
      <PaginationPage totalCount={totalCount} />
    </section>
  );
}
