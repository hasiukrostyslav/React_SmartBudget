interface ButtonProps {
  children: React.ReactNode;
  type?: 'submit' | 'reset' | 'button';
  className?: string;
}

export default function Button({
  children,
  type = 'button',
  className,
}: ButtonProps) {
  return (
    <button
      className={`outline-round-md bg-blue-600 hover:bg-blue-500 text-slate-100 rounded-md px-3 py-2 ${className}`}
      type={type}
    >
      {children}
    </button>
  );
}
