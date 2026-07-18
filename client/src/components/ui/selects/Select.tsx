import type { SelectOption } from '@/types/types';


import { useSelectDropdown } from '@/hooks/useSelectDropdown';

import SelectContent from './SelectContent';
import SelectTrigger from './SelectTrigger';
import SelectValue from './SelectValue';
import SelectWrapper from './SelectWrapper';
import { SELECT_CONFIG } from '@/lib/constants/components';

interface SelectProps {
  label: string;
  options: SelectOption[];
  selectedValue: string | number | undefined;
  placeholder?: string;
  padding?: keyof typeof SELECT_CONFIG.padding;
  variant?: keyof typeof SELECT_CONFIG.variant;
  showSelectedOption: boolean;
  groupPosition?: 'start' | 'end';
  contentPosition?: 'top' | 'bottom';
  contentExpandedAlign?: 'left' | 'right';
  contentWidthExpandedTo?: string;
  withSearch?: boolean;
  disabled?: boolean;
  onSelect: (value: string | number) => void;
}

export default function Select({
  label,
  options,
  selectedValue,
  placeholder,
  padding = 'sm',
  variant = 'primary',
  showSelectedOption,
  groupPosition,
  contentPosition = 'bottom',
  contentWidthExpandedTo,
  contentExpandedAlign,
  withSearch,
  disabled,
  onSelect,
}: SelectProps) {
  const {
    id,
    isContentExpanded,
    selectRef,
    handleBlur,
    handleSelect,
    handleToggleExpanded,
  } = useSelectDropdown(onSelect);

  return (
    <SelectWrapper
      id={id}
      isContentExpanded={isContentExpanded}
      ref={selectRef}
      onBlur={handleBlur}
      ariaHasPopup="listbox"
    >
      <SelectTrigger
        id={id}
        label={label}
        padding={padding}
        variant={variant}
        disabled={disabled}
        isContentExpanded={isContentExpanded}
        groupPosition={groupPosition}
        onClick={handleToggleExpanded}
        ariaHasPopup="listbox"
      >
        <SelectValue
          selectedValue={options.find((el) => el.value === selectedValue)}
          placeholder={placeholder}
        />
      </SelectTrigger>

      <SelectContent
        id={id}
        options={options}
        selectedValue={selectedValue}
        isContentExpanded={isContentExpanded}
        showSelectedOption={showSelectedOption}
        position={contentPosition}
        widthExpandedTo={contentWidthExpandedTo}
        expandedAlign={contentExpandedAlign}
        withSearch={withSearch}
        onSelect={handleSelect}
      />
    </SelectWrapper>
  );
}
