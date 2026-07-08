import { clsx } from 'clsx';

import type { IconName } from '@/types/types';

import Icon from '../icons/Icon';

interface SegmentedControlRadioItemProps {
  option: string;
  iconName: IconName;
  color: string;
  selectedValue: string;
  onSelect: (option: string) => void;
}

export default function SegmentedControlRadioItem({
  option,
  iconName,
  color,
  selectedValue,
  onSelect,
}: SegmentedControlRadioItemProps) {
  return (
    <label
      tabIndex={0}
      role="radio"
      className={clsx(
        'outline-input w-1/2 cursor-pointer rounded-md px-4 py-1.5',
        selectedValue === option
          ? `bg-slate-50 dark:bg-slate-700 ${color}`
          : 'text-slate-500',
      )}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          onSelect(option);
        }
      }}
    >
      <div className={clsx('flex items-center justify-center gap-1 text-sm')}>
        <Icon name={iconName} size={16} />
        <span>{option}</span>
      </div>
      <input
        type="radio"
        className="peer hidden"
        onChange={() => onSelect(option)}
        name={option}
        value={option}
        checked={selectedValue === option}
      />
    </label>
  );
}
