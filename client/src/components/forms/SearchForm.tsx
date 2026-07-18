import clsx from 'clsx';

import { INPUT_CONFIG } from '@/lib/constants/components';

import Input from '../ui/inputs/Input';

interface SearchFormProps {
  className?: string;
  placeholder: string;
  inputPadding: keyof typeof INPUT_CONFIG.padding;
}

export default function SearchForm({
  className,
  placeholder,
  inputPadding,
}: SearchFormProps) {
  return (
    <form className={clsx('relative rounded-md', className)} autoComplete="off">
      <Input
        placeholder={placeholder}
        name="search"
        padding={inputPadding}
        iconName="search"
      />
    </form>
  );
}
