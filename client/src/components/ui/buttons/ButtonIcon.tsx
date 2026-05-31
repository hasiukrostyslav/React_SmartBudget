import clsx from 'clsx';

import type { IconName } from '@/types/types';

import Tooltip from '../atomic/Tooltip';
import Icon from '../icons/Icon';

interface ButtonIconProps {
  iconName: IconName;
  size: number;
  shape: 'round' | 'square';
  variant: 'solid' | 'outline';
  tooltipLabel?: string;
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
  tooltipContainer?: HTMLElement | null;
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
  tooltipLabel,
  tooltipSide,
  tooltipContainer,
  className,
  iconClassName,
  onClick,
  padding = 'base',
}: ButtonIconProps) {
  return (
    <Tooltip
      label={tooltipLabel}
      side={tooltipSide}
      container={tooltipContainer}
    >
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
    </Tooltip>
  );
}
