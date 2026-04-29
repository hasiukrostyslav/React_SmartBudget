import clsx from 'clsx';
import { BUTTON_STYLES } from '@/lib/constants/styles';

interface ButtonProps {
  children: React.ReactNode;
  type?: 'submit' | 'reset' | 'button';
  className?: string;
  disabled?: boolean;
  color: keyof typeof BUTTON_STYLES.color;
  size: keyof typeof BUTTON_STYLES.size;
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
        disabled ? 'border-slate-400 bg-slate-400' : BUTTON_STYLES.color[color],
        BUTTON_STYLES.size[size],
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
