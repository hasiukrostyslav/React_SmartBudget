import { clsx } from 'clsx';

import type { IconName } from '@/types/types';

import Icon from '../icons/Icon';

interface RadioCardProps {
  option: string;
  selectedValue: string;
  isCurrent: boolean;
  icon: IconName;
  text: { header: string; description: string };
  styleConfig: {
    badge: string;
    card: string;
    icon: string;
    radio: string;
  };
  handleSelect: (option: string) => void;
}

export default function RadioCard({
  option,
  selectedValue,
  isCurrent,
  icon,
  text,
  styleConfig,
  handleSelect,
}: RadioCardProps) {
  return (
    <label
      tabIndex={0}
      role="radio"
      className={clsx(
        'outline-input flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-2',
        selectedValue === option || (!selectedValue && isCurrent)
          ? styleConfig.card
          : `border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700`,
      )}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSelect(option);
        }
      }}
    >
      <div className={clsx('rounded-md p-1.5', styleConfig.icon)}>
        <Icon name={icon} size={20} />
      </div>
      <div>
        <h2 className="flex items-center gap-2 font-semibold dark:text-slate-300">
          {text.header.length > 15 && isCurrent
            ? text.header.slice(0, 12) + '...'
            : text.header}
          {isCurrent && (
            <span className="rounded-xl bg-slate-300 px-2 text-xs text-slate-700">
              CURRENT
            </span>
          )}
        </h2>
        <p className="text-xs text-slate-500">{text.description}</p>
      </div>
      <span
        className={clsx(
          'ml-auto h-4 w-4 rounded-full',
          selectedValue === option || (!selectedValue && isCurrent)
            ? styleConfig.radio + ' border-6'
            : 'border border-slate-300 dark:border-slate-700',
        )}
      ></span>
      <input
        type="radio"
        className="peer hidden"
        onChange={() => handleSelect(option)}
        name={option}
        value={option}
        checked={selectedValue === option}
      />
    </label>
  );
}
