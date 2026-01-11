import clsx from 'clsx';
import type { IconName } from '@/types/types';
import Icon from '../Icon';

interface ButtonIconProps {
  iconName: IconName;
  size: number;
  shape: 'round' | 'square';
  variant: 'solid' | 'outline';
  padding?: 'sm' | 'base';
  className?: string;
  iconClassName?: string;
  onClick?: () => void;
}

export default function ButtonIcon({
  iconName,
  size,
  shape,
  variant,
  className,
  iconClassName,
  onClick,
  padding = 'base',
}: ButtonIconProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        padding === 'base' ? 'p-1.5' : 'p-0.5',
        shape === 'round'
          ? 'outline-round-full rounded-full'
          : 'outline-round-sm',
        variant === 'solid'
          ? 'bg-blue-200/45 text-slate-500 dark:bg-slate-600 dark:text-slate-400'
          : '',
        className,
      )}
    >
      <Icon className={iconClassName} name={iconName} size={size} />
    </button>
  );
}
