import clsx from 'clsx';

import type { IconName } from '@/types/types';

import Icon from '../icons/Icon';

interface ToolbarButtonProps {
  iconName: IconName;
  label: string;
  iconSize: number;
  onClick: () => void;
  disabled?: boolean;
}

export default function ToolbarButton({
  iconName,
  label,
  iconSize,
  onClick,
  disabled,
}: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'outline-input flex items-center justify-center gap-1 rounded-md px-4 py-1',
        disabled
          ? 'cursor-default text-slate-400'
          : `bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800/10`,
      )}
    >
      <Icon name={iconName} size={iconSize} />
      <span>{label}</span>
    </button>
  );
}
