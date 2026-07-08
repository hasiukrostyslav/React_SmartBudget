import clsx from 'clsx';

import type { SelectOption } from '@/types/types';

import SelectOptionItem from './SelectOptionItem';

interface SelectItemProps {
  isContentExpanded: boolean;
  showSelectedOption: boolean;
  selectedValue: string | number | undefined;
  option: SelectOption;
  onSelect: (option: string | number) => void;
}

export default function SelectItem({
  isContentExpanded,
  showSelectedOption,
  selectedValue,
  option,
  onSelect,
}: SelectItemProps) {
  return (
    <button
      role="option"
      tabIndex={isContentExpanded ? 0 : -1}
      aria-selected={selectedValue === option.value}
      disabled={selectedValue === option.value}
      onClick={() => onSelect(option.value)}
      type="button"
      className={clsx(
        'outline-input flex w-full rounded-md px-1.5 py-1',
        selectedValue === option.value && !showSelectedOption ? 'hidden' : '',
        selectedValue === option.value
          ? 'bg-blue-400/50 dark:bg-slate-900/50'
          : 'hover:bg-blue-200/50 dark:hover:bg-slate-600/40',
      )}
    >
      <SelectOptionItem
        option={option}
        context="list"
        selectedValue={selectedValue}
        showSelectedOption={showSelectedOption}
      />
    </button>
  );
}
