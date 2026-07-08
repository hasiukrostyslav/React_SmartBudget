import clsx from 'clsx';

import type { IconName } from '@/types/types';

import Tooltip from '../atomic/Tooltip';
import Icon from '../icons/Icon';

interface ButtonIconProps {
  iconName: IconName;
  size: number;
  shape: 'round' | 'square';
  variant: 'solid' | 'ghost' | 'outline';
  tooltipLabel?: string;
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
  type?: 'button' | 'submit';
  className?: string;
  iconClassName?: string;
  onClick?: () => void;
}

const style = {
  solid: 'bg-blue-200/45 text-slate-500 dark:bg-slate-600 dark:text-slate-400',
  ghost: 'hover:bg-slate-200 dark:hover:bg-slate-700',
  outline:
    'border border-slate-300 dark:border-slate-600 hover:border-slate-400',
};

export default function ButtonIcon({
  iconName,
  size,
  shape,
  variant,
  tooltipLabel,
  tooltipSide,
  type = 'button',
  className,
  iconClassName,
  onClick,
}: ButtonIconProps) {
  return (
    <Tooltip label={tooltipLabel} side={tooltipSide}>
      <button
        type={type}
        onClick={onClick}
        className={clsx(
          'outline-input p-1.5',
          style[variant],
          shape === 'round' ? 'rounded-full' : 'rounded-md',
          className,
        )}
      >
        <Icon className={iconClassName} name={iconName} size={size} />
      </button>
    </Tooltip>
  );
}
