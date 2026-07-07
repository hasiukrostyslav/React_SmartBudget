import clsx from 'clsx';

import type { SelectOption } from '@/types/types';

import { useSearchInput } from '@/hooks/useSearchInput';
import { useTheme } from '@/hooks/useTheme';

import EmptySearchResult from '../feedback/EmptySearchResult';
import Input from '../inputs/Input';
import PopoverPanel from './PopoverPanel';
import SelectItem from './SelectItem';

interface SelectContentProps {
  id: string;
  options: SelectOption[];
  selectedValue: string | number | undefined;
  isContentExpanded: boolean;
  showSelectedOption: boolean;
  position: 'top' | 'bottom';
  widthExpandedTo?: string;
  expandedAlign?: 'left' | 'right';
  withSearch?: boolean;
  onSelect: (option: string | number) => void;
}

export default function SelectContent({
  id,
  options,
  selectedValue,
  isContentExpanded,
  showSelectedOption,
  position,
  widthExpandedTo,
  expandedAlign = 'left',
  withSearch,
  onSelect,
}: SelectContentProps) {
  const { theme } = useTheme();
  const { searchQuery, role, onChange, onClear } = useSearchInput();

  const filteredOptions = options
    .toSorted((a, b) =>
      a.label.localeCompare(b.label, undefined, { numeric: true }),
    )
    .filter((el) =>
      searchQuery.length === 0
        ? el
        : el.label
            .toLowerCase()
            .includes(searchQuery.trimStart().toLowerCase()) ||
          (el.description &&
            el.description
              .toLowerCase()
              .includes(searchQuery.trimStart().toLowerCase())),
    );

  return (
    <PopoverPanel
      id={id}
      isContentExpanded={isContentExpanded}
      position={position}
      widthExpandedTo={widthExpandedTo}
      expandedAlign={expandedAlign}
    >
      {withSearch && (
        <div className="mb-2 border-b border-slate-300 p-2 dark:border-slate-600">
          <Input
            name="search"
            placeholder="Search categories..."
            iconName="search"
            padding="sm"
            value={searchQuery}
            onChange={onChange}
            onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
            trailingButton={{ role, onClick: onClear }}
          />
        </div>
      )}
      <div
        className={clsx(
          withSearch ? 'max-h-60' : 'max-h-75',
          'scrollbar grid gap-1 overflow-y-auto p-2',
          theme === 'dark' ? 'scrollbar-dark' : '',
        )}
      >
        {withSearch && filteredOptions.length === 0 ? (
          <EmptySearchResult
            category="category"
            query={searchQuery}
            onClick={onClear}
          />
        ) : (
          filteredOptions.map((option) => (
            <SelectItem
              key={option.value}
              option={option}
              onSelect={onSelect}
              selectedValue={selectedValue}
              showSelectedOption={showSelectedOption}
              isContentExpanded={isContentExpanded}
            />
          ))
        )}
      </div>
    </PopoverPanel>
  );
}
