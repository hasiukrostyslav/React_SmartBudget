interface ButtonProps {
  children: React.ReactNode;
  type?: 'submit' | 'reset' | 'button';
  className?: string;
  disabled?: boolean;
  color: keyof typeof buttonColors;
}

const buttonColors = {
  black:
    'bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500',
  blue: 'bg-blue-600 hover:bg-blue-500',
};

export default function Button({
  children,
  type = 'button',
  className,
  disabled,
  color,
}: ButtonProps) {
  return (
    <button
      className={`outline-round-md rounded-md px-3 py-2.5 text-slate-100 ${className} ${
        disabled ? 'bg-slate-400' : buttonColors[color]
      }`}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
