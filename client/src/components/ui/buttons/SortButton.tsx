import clsx from 'clsx';

import Icon from '../icons/Icon';

interface SortButtonProps {
  name: string;
  label: string;
  isActive: boolean;
  order: string | null;
  onClick: (label: string) => void;
}

export default function SortButton({
  name,
  label,
  isActive,
  order,
  onClick,
}: SortButtonProps) {
  return (
    <div className="text-xs">
      <button
        onClick={() => onClick(label)}
        type="button"
        className={clsx(
          'outline-round-sm flex items-center gap-1 rounded-md px-1.5 py-0.5',
          'hover:bg-slate-300/40 dark:hover:bg-slate-700/40',
          isActive ? 'text-blue-500' : 'text-slate-500',
        )}
      >
        <span>{name}</span>
        <Icon
          name="arrow-up"
          size={12}
          className={clsx(
            'transition-all duration-300 ease-in',
            isActive && order === 'desc' ? 'rotate-180' : '',
          )}
        />
      </button>
    </div>
  );
}
