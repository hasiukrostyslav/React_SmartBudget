import clsx from 'clsx';
import { Link } from 'react-router';

import type { IconName } from '@/types/types';

import Icon from '../icons/Icon';

interface ButtonProps {
  children?: React.ReactNode;
  variant: keyof typeof VARIANTS;
  size: keyof typeof SIZES;
  type?: 'button' | 'submit' | 'reset';
  href?: string;
  icon?: IconName;
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
  onClick?: () => void;
}

const SIZES = {
  sm: 'px-3 py-1.75 text-sm leading-5 rounded-lg',
  md: 'px-4 py-2.25 text-sm rounded-xl',
  lg: 'px-5.5 py-2.5 text-base leading-6 rounded-xl',
  form: 'w-full px-6 py-3.25 text-base leading-6 rounded-xl font-bold',
} as const;

const ICON_SIZES = {
  sm: 16,
  md: 18,
  lg: 20,
  form: 24,
} as const;

const VARIANTS = {
  primary: `bg-primary border-primary text-card shadow-glow 
  hover:border-primary-hover hover:bg-primary-hover  
  disabled:bg-line disabled:border-line disabled:text-muted disabled:shadow-none
  dark:shadow-none dark:disabled:bg-dark-hover dark:disabled:text-dark-placeholder
  dark:disabled:border-dark-hover`,
  secondary: `border-line bg-card text-body font-semibold
  hover:border-placeholder hover:bg-subtle
  disabled:border-line disabled:bg-subtle disabled:text-placeholder 
  dark:border-dark-line dark:bg-transparent dark:text-dark-heading dark:hover:bg-dark-hover 
  dark:disabled:border-dark-hover dark:disabled:bg-transparent dark:disabled:text-dark-placeholder`,
  soft: `bg-primary-soft border-primary-soft text-primary hover:bg-primary-light 
  disabled:bg-hover disabled:text-placeholder dark:bg-dark-hover dark:border-dark-hover  
  dark:text-dark-link dark:hover:bg-dark-selected dark:disabled:bg-dark-hover 
  dark:disabled:text-dark-placeholder`,
  ghost: `bg-transparent border-transparent text-secondary hover:bg-hover hover:text-heading 
  disabled:bg-transparent disabled:text-placeholder dark:text-dark-muted 
  dark:hover:bg-dark-hover dark:hover:text-dark-heading dark:disabled:bg-transparent 
  dark:disabled:text-dark-placeholder`,
  danger: `bg-danger border-danger text-white hover:bg-danger-text disabled:bg-line 
  disabled:text-muted dark:disabled:bg-dark-hover dark:disabled:border-dark-hover 
  dark:disabled:text-dark-placeholder disabled:border-line`,
  dangerOutline: `border-danger-border bg-card text-danger-text hover:bg-danger-panel 
  disabled:border-line disabled:bg-subtle disabled:text-placeholder 
  dark:border-dark-danger-bg dark:bg-dark-danger-bg dark:text-dark-danger-text 
  dark:hover:border-dark-danger-text dark:disabled:border-dark-hover 
  dark:disabled:bg-dark-card dark:disabled:text-dark-placeholder dark:hover:bg-dark-danger-bg`,
} as const;

export default function Button({
  children,
  variant,
  size,
  type,
  href,
  icon,
  disabled,
  className,
  isLoading,
  onClick,
}: ButtonProps) {
  if (href)
    return (
      <Link
        className={clsx(
          'flex items-center justify-center gap-2 border',
          'disabled:cursor-not-allowed',
          variant === 'primary' ? 'outline-round-md' : 'outline-input',
          VARIANTS[variant],
          SIZES[size],
          className,
        )}
        to={href}
      >
        <span className="flex items-center justify-center gap-2">
          {icon && <Icon size={ICON_SIZES[size]} name={icon} />}
          {children}
        </span>
      </Link>
    );

  return (
    <button
      className={clsx(
        'flex items-center justify-center gap-2 border',
        'disabled:cursor-not-allowed',
        variant === 'primary' ? 'outline-round-md' : 'outline-input',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      <span className="flex items-center justify-center gap-2">
        {isLoading && (
          <Icon
            size={ICON_SIZES[size]}
            name={'loader-circle'}
            className={'animate-spin'}
          />
        )}

        {icon && !isLoading && <Icon size={ICON_SIZES[size]} name={icon} />}
        {!isLoading ? children : 'Savings...'}
      </span>
    </button>
  );
}
