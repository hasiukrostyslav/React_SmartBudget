import clsx from 'clsx';

import { useSelect } from '@/hooks/useSelect';

import Icon from '../icons/Icon';
import SelectContent from './SelectContent';
import SelectDisplay from './SelectDisplay';

interface SelectProps {
  name: string;
  data: (string | number)[];
  defaultOption?: string | number;
  placeholder?: string;
  className?: string;
  width?: 'sm' | 'md' | 'lg' | 'full';
  padding?: 'sm' | 'md' | 'lg';
  color?: 'transparent' | 'blue';
  contentPosition?: 'top' | 'bottom';
  autoFetchOnChange?: boolean;
  disabled?: boolean;
  onSelectValue?: (value: string | number) => void;
}

const styles = {
  width: {
    sm: 'min-w-18 gap-2',
    md: 'min-w-38 gap-5',
    lg: 'min-w-44 gap-5',
    full: 'w-full',
  },
  padding: { sm: 'py-1.5', md: 'py-2', lg: 'py-2.5' },
  color: {
    blue: 'border-blue-300 bg-blue-200/50 text-slate-700 dark:border-slate-500 dark:bg-slate-800',
    transparent:
      'border-slate-300 dark:border-slate-500 dark:bg-slate-800 text-slate-700',
  },
};

export default function Select({
  name,
  data,
  defaultOption,
  placeholder,
  className,
  width = 'md',
  padding = 'sm',
  color = 'transparent',
  contentPosition = 'bottom',
  autoFetchOnChange = false,
  disabled,
  onSelectValue,
}: SelectProps) {
  const {
    id,
    isExpanded,
    selectedOption,
    selectRef,
    handleBlur,
    handleSelect,
    handleToggleExpanded,
  } = useSelect({
    defaultOption,
    param: name,
    autoFetchOnChange,
    onSelectValue,
  });

  return (
    <div
      role="combobox"
      aria-haspopup="listbox"
      aria-controls={`select-list-${id}`}
      aria-labelledby={`select-label-${id}`}
      aria-expanded={isExpanded}
      ref={selectRef}
      className={clsx('relative', className)}
      onBlur={handleBlur}
    >
      <button
        id={`select-label-${id}`}
        name={name}
        aria-haspopup="listbox"
        aria-controls={`select-list-${id}`}
        aria-expanded={isExpanded}
        type="button"
        onClick={handleToggleExpanded}
        disabled={disabled}
        className={clsx(
          'flex items-center justify-between px-2.5 text-sm font-medium',
          'outline-input rounded-md border',
          'dark:text-slate-400',
          styles.width[width],
          styles.padding[padding],
          disabled
            ? 'border-slate-300 bg-slate-200/50 text-slate-400 dark:border-slate-500 dark:bg-slate-600'
            : styles.color[color],
        )}
      >
        <SelectDisplay
          selectedOption={selectedOption}
          bulkLabel={name}
          placeholder={placeholder}
        />
        <Icon
          size={16}
          name="chevron-down"
          className={clsx(
            'transform transition-transform duration-400 ease-in-out',
            isExpanded ? 'rotate-180' : 'rotate-0',
          )}
        />
      </button>

      <SelectContent
        id={id}
        data={data}
        bulkLabel={name}
        defaultOption={defaultOption}
        selectedOption={selectedOption}
        isSelectExpanded={isExpanded}
        position={contentPosition}
        onSelect={handleSelect}
      />
    </div>
  );
}
