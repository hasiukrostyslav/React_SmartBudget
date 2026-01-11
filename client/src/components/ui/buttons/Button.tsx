import clsx from 'clsx';

interface ButtonProps {
  children: React.ReactNode;
  type?: 'submit' | 'reset' | 'button';
  className?: string;
  disabled?: boolean;
  color: keyof typeof buttonStyles.color;
  size: keyof typeof buttonStyles.size;
  onClick?: () => void;
}

const buttonStyles = {
  color: {
    black: `border-slate-900 bg-slate-900 hover:border-slate-800 hover:bg-slate-800 
    dark:border-blue-600 dark:bg-blue-600 dark:hover:border-blue-500 dark:hover:bg-blue-500`,
    blue: 'border-blue-600 bg-blue-600 hover:border-blue-500 hover:bg-blue-500',
    transparent: `text-slate-600 border-transparent hover:text-slate-500 dark:text-slate-400`,
    outline: `border-slate-500 text-slate-500 hover:border-slate-600 hover:text-slate-600 
     dark:border-slate-400 dark:text-slate-400 dark:hover:text-slate-500 dark:hover:border-slate-500 focus:border-transparent`,
  },
  size: {
    xs: 'outline-round-sm px-2 ',
    sm: 'outline-round-sm px-2 py-1',
    md: 'outline-round-sm px-2 py-1.5',
    lg: 'outline-round-md px-3 py-2.5',
  },
};

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
        disabled ? 'border-slate-400 bg-slate-400' : buttonStyles.color[color],
        buttonStyles.size[size],
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
