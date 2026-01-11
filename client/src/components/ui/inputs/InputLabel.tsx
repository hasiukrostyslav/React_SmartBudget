import clsx from 'clsx';

interface InputLabelProps {
  label: string;
  htmlFor?: string;
  margin?: 'sm' | 'md' | 'lg';
}

export default function InputLabel({
  label,
  htmlFor,
  margin = 'md',
}: InputLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={clsx(
        'block text-sm tracking-wider dark:text-slate-200',
        margin === 'sm' ? 'mb-1' : 'mb-2',
      )}
    >
      {label}
    </label>
  );
}
