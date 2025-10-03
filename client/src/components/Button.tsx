interface ButtonProps {
  children: React.ReactNode;
  type?: 'submit' | 'reset' | 'button';
  className?: string;
  disabled?: boolean;
}

export default function Button({
  children,
  type = 'button',
  className,
  disabled,
}: ButtonProps) {
  return (
    <button
      className={`outline-round-md rounded-md px-3 py-2 text-slate-100 ${className} ${
        disabled ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-500'
      }`}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
