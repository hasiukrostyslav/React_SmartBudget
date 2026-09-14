import clsx from 'clsx';

import type { IconName } from '@/types/types';

import Tooltip from '../atomic/Tooltip';
import Icon from '../icons/Icon';

interface ButtonIconBaseProps {
  iconName: IconName;
  size: number;
  shape: 'round' | 'square';
  variant: 'solid' | 'ghost' | 'outline' | 'primary';
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
  type?: 'button' | 'submit';
  className?: string;
  iconClassName?: string;
  disabled?: boolean;
  onClick?: () => void;
}

// An icon-only button has no text, so it needs an accessible name: the tooltip
// text when there is one, otherwise an explicit label. The type requires one.
type ButtonIconProps = ButtonIconBaseProps &
  (
    | { tooltipLabel: string; label?: never }
    | { tooltipLabel?: never; label: string }
  );

const style = {
  solid: 'bg-blue-200/45 text-slate-500 dark:bg-slate-600 dark:text-slate-400',
  ghost: 'hover:bg-slate-200 dark:hover:bg-slate-700',
  primary:
    'hover:bg-blue-200 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400',
  outline:
    'border border-slate-300 dark:border-slate-600 hover:border-slate-400',
};

export default function ButtonIcon({
  iconName,
  size,
  shape,
  variant,
  tooltipLabel,
  label,
  tooltipSide,
  type = 'button',
  className,
  iconClassName,
  disabled,
  onClick,
}: ButtonIconProps) {
  return (
    <Tooltip label={tooltipLabel} side={tooltipSide}>
      <button
        type={type}
        aria-label={tooltipLabel ?? label}
        disabled={disabled}
        onClick={onClick}
        className={clsx(
          'outline-input p-1.5 disabled:cursor-not-allowed disabled:opacity-50',
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
