import { useSearchParams } from 'react-router';

import { getPageSizeOption } from '@/lib/utils/utils';

import Select from '../selects/Select';

interface PaginationFilterProps {
  totalCount: number;
}

export default function PaginationFilter({
  totalCount,
}: PaginationFilterProps) {
  const [searchParams] = useSearchParams();
  const limit = searchParams.get('limit');

  const pageSizeOptions = getPageSizeOption(totalCount);

  return (
    <div className="flex items-center gap-2">
      <span>Showing</span>
      <Select
        name="limit"
        data={pageSizeOptions}
        defaultOption={limit ? Number(limit) : pageSizeOptions[0]}
        width="sm"
        color="blue"
        contentPosition="top"
        autoFetchOnChange
        disabled={pageSizeOptions.length === 1}
      />
      <span>out of {totalCount}</span>
    </div>
  );
}
