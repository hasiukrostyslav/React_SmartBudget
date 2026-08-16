import clsx from 'clsx';
import { Link } from 'react-router';

import { BUTTON_CONFIG } from '@/lib/constants/components';

interface ButtonProps {
  children: React.ReactNode;
  type?: 'submit' | 'reset' | 'button';
  className?: string;
  disabled?: boolean;
  color: keyof typeof BUTTON_CONFIG.color;
  size: keyof typeof BUTTON_CONFIG.size;
  onClick?: () => void;
  href?: string;
}

export default function Button({
  children,
  type = 'button',
  className,
  disabled,
  color,
  size,
  onClick,
  href,
}: ButtonProps) {
  const buttonClassName = clsx(
    'flex items-center justify-center gap-1 rounded-md border text-slate-100',
    disabled
      ? 'border-slate-400 bg-slate-400 dark:border-slate-600 dark:bg-slate-600 dark:text-slate-500'
      : BUTTON_CONFIG.color[color],
    BUTTON_CONFIG.size[size],
    className,
  );

  if (href)
    return (
      <Link className={buttonClassName} to={href}>
        {children}
      </Link>
    );

  return (
    <button
      className={buttonClassName}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
