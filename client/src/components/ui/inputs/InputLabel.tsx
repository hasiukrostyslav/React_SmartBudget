import clsx from 'clsx';

import { INPUT_CONFIG } from '@/lib/constants/ui';

interface InputLabelProps {
  label: string;
  htmlFor?: string;
  margin?: keyof typeof INPUT_CONFIG.padding;
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
