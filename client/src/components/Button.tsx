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
      className={`outline-round-md rounded-md bg-blue-600 px-3 py-2 text-slate-100 hover:bg-blue-500 ${className}`}
      type={type}
    >
      {children}
    </button>
  );
}
