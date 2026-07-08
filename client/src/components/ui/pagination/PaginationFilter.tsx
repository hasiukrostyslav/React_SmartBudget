import type { SelectOption } from '@/types/types';

import { getPageSizeOption } from '@/lib/utils/utils';
import { useSelectValue } from '@/hooks/useSelectValue';

import Select from '../selects/Select';

interface PaginationFilterProps {
  totalCount: number;
  limit: number;
  itemsRange: {
    min: number;
    max: number;
  };
}

export default function PaginationFilter({
  totalCount,
  limit,
  itemsRange,
}: PaginationFilterProps) {
  const pageSizeOptions = getPageSizeOption(totalCount);
  const options: SelectOption[] = pageSizeOptions.map((value) => ({
    value,
    label: String(value),
  }));

  const { selectedValue, handleSelect } = useSelectValue({
    defaultValue: limit ? Number(limit) : pageSizeOptions[0],
    param: 'limit',
  });

  return (
    <div className="flex items-center text-sm text-slate-500">
      <div className="border-r border-slate-300 pr-2 dark:border-slate-700">
        <span className="font-semibold text-slate-600 dark:text-slate-300">
          {itemsRange.min}-{itemsRange.max}
        </span>{' '}
        of {totalCount}
      </div>

      <div className="flex items-center gap-2 pl-2">
        <span>Rows per page</span>
        <Select
          label="limit"
          options={options}
          selectedValue={selectedValue}
          onSelect={handleSelect}
          padding="xs"
          variant="secondary"
          contentPosition="top"
          showSelectedOption={false}
          disabled={pageSizeOptions.length === 1}
        />
      </div>
    </div>
  );
}
