import { useState } from 'react';

import { SELECT_CONFIG } from '@/lib/constants/components';
import { useCalendar } from '@/hooks/useCalendar';
import { useSelectDropdown } from '@/hooks/useSelectDropdown';

import Button from '../buttons/Button';
import Calendar from './Calendar';
import PopoverPanel from './PopoverPanel';
import SelectTrigger from './SelectTrigger';
import SelectValue from './SelectValue';
import SelectWrapper from './SelectWrapper';
import TimeSelect from './TimeSelect';

interface DatePickerProps {
  label: string;
  selectedValue: Date;
  placeholder?: string;
  padding?: keyof typeof SELECT_CONFIG.padding;
  variant?: keyof typeof SELECT_CONFIG.variant;
  groupPosition?: 'start' | 'end';
  contentPosition?: 'top' | 'bottom';
  contentExpandedAlign?: 'left' | 'right';
  contentWidthExpandedTo?: string;
  disabled?: boolean;
  onSelect: (value: Date) => void;
}

export default function DatePicker({
  label,
  selectedValue,
  placeholder,
  padding = 'sm',
  variant = 'primary',
  groupPosition,
  contentPosition = 'top',
  contentExpandedAlign,
  contentWidthExpandedTo,
  disabled,
  onSelect,
}: DatePickerProps) {
  const { days, cursor, toNextMonth, toPrevMonth, goToMonth, formattedDate } =
    useCalendar(selectedValue);
  const {
    id,
    isContentExpanded,
    selectRef,
    handleBlur,
    handleToggleExpanded,
    handleClose,
  } = useSelectDropdown();

  const [draft, setDraft] = useState(selectedValue);

  const handleSelectDay = (day: Date) => {
    goToMonth(day);
    setDraft(day);
  };

  const handleDone = () => {
    onSelect(draft);
    handleClose();
  };

  return (
    <SelectWrapper
      id={id}
      isContentExpanded={isContentExpanded}
      ref={selectRef}
      onBlur={handleBlur}
      ariaHasPopup="dialog"
    >
      <SelectTrigger
        id={id}
        label={label}
        padding={padding}
        variant={variant}
        disabled={disabled}
        isContentExpanded={isContentExpanded}
        groupPosition={groupPosition}
        onClick={() => {
          handleToggleExpanded();
          // Every opening starts from the saved date, on its month, instead of
          // wherever the previous visit left the draft and the calendar.
          setDraft(selectedValue);
          goToMonth(selectedValue);
        }}
        ariaHasPopup="dialog"
        iconName="calendar"
      >
        <SelectValue
          selectedValue={{ label: formattedDate, value: formattedDate }}
          placeholder={placeholder}
        />
      </SelectTrigger>

      <PopoverPanel
        id={id}
        isContentExpanded={isContentExpanded}
        position={contentPosition}
        widthExpandedTo={contentWidthExpandedTo}
        expandedAlign={contentExpandedAlign}
      >
        <Calendar
          onSelect={handleSelectDay}
          cursor={cursor}
          selected={draft}
          days={days}
          onNextMonth={toNextMonth}
          onPrevMonth={toPrevMonth}
        />
        <TimeSelect selectedValue={draft} onChange={setDraft}>
          <Button
            color="blue"
            size="sm"
            onClick={handleDone}
            // By time, not reference: an equal date can be a new Date object.
            disabled={draft.getTime() === selectedValue.getTime()}
          >
            Done
          </Button>
        </TimeSelect>
      </PopoverPanel>
    </SelectWrapper>
  );
}
