import clsx from 'clsx';

import { BUTTON_CONFIG } from '@/lib/constants/ui';

interface ButtonProps {
  children: React.ReactNode;
  type?: 'submit' | 'reset' | 'button';
  className?: string;
  disabled?: boolean;
  color: keyof typeof BUTTON_CONFIG.color;
  size: keyof typeof BUTTON_CONFIG.size;
  onClick?: () => void;
}

export default function Button({
  children,
  type = 'button',
  className,
  disabled,
  color,
  size,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'flex items-center justify-center gap-1 rounded-md border text-slate-100',
        disabled ? 'border-slate-400 bg-slate-400' : BUTTON_CONFIG.color[color],
        BUTTON_CONFIG.size[size],
        className,
      )}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
