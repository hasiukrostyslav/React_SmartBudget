import clsx from 'clsx';

import { useTheme } from '@/hooks/useTheme';

import SelectItem from './SelectItem';

interface SelectContentProps {
  id: string;
  data: (string | number)[];
  bulkLabel: string;
  defaultOption: string | number | undefined;
  selectedOption: string | number | undefined;
  isSelectExpanded: boolean;
  position: 'top' | 'bottom';
  onSelect: (option: string | number) => void;
}

export default function SelectContent({
  id,
  data,
  bulkLabel,
  defaultOption,
  selectedOption,
  isSelectExpanded,
  position,
  onSelect,
}: SelectContentProps) {
  const { theme } = useTheme();
  const sortedData = data.every((el) => typeof el === 'string')
    ? data.toSorted()
    : data;

  const renderData =
    defaultOption === 'all' ? [defaultOption, ...sortedData] : sortedData;

  return (
    <div
      id={`select-list-${id}`}
      role="listbox"
      className={clsx(
        'absolute z-50 w-full text-sm',
        'transition-all duration-400 ease-in',
        isSelectExpanded ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0',
        position === 'top'
          ? 'bottom-[calc(100%+4px)] origin-bottom'
          : 'origin-top translate-y-1',
      )}
    >
      <div
        tabIndex={-1}
        className={clsx(
          'scrollbar grid max-h-75 gap-1 p-2 shadow-md',
          'rounded-md border border-slate-300 dark:border-slate-600',
          'overflow-y-auto bg-slate-50 dark:bg-slate-800 dark:text-slate-400',
          theme === 'dark' ? 'scrollbar-dark' : '',
        )}
      >
        {renderData.map((option) => (
          <SelectItem
            key={option}
            option={option}
            onSelect={onSelect}
            bulkLabel={bulkLabel}
            selectedOption={selectedOption}
            isSelectExpanded={isSelectExpanded}
          />
        ))}
      </div>
    </div>
  );
}
