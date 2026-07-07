import clsx from 'clsx';

import type { IconName } from '@/types/types';

import { MODAL_CONFIG } from '@/lib/constants/ui';

import Icon from '../icons/Icon';

interface ToolbarButtonProps {
  iconName: IconName;
  label: string;
  iconSize: number;
  modalCategory?: keyof typeof MODAL_CONFIG.header;
  disabled?: boolean;
  onClick: () => void;
}

export default function ToolbarButton({
  iconName,
  label,
  iconSize,
  modalCategory,
  disabled,
  onClick,
}: ToolbarButtonProps) {
  const CONFIG = MODAL_CONFIG.header;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'outline-input flex items-center justify-center gap-1 rounded-md px-4 py-1',
        modalCategory
          ? CONFIG[modalCategory].button
          : 'text-blue-600 dark:text-blue-400',
        disabled ? 'cursor-default text-slate-400 dark:text-slate-400' : '',
      )}
    >
      <Icon name={iconName} size={iconSize} />
      <span>{label}</span>
    </button>
  );
}
