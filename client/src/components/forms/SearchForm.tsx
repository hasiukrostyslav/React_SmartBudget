import clsx from 'clsx';
import SearchInput from '../ui/inputs/SearchInput';

interface SearchFormProps {
  className?: string;
  placeholder: string;
  size: 'sm' | 'md' | 'lg';
}

export default function SearchForm({
  className,
  placeholder,
  size,
}: SearchFormProps) {
  return (
    <form
      className={clsx(
        'relative rounded-md bg-slate-200 dark:bg-slate-600',
        className,
      )}
      autoComplete="off"
    >
      <SearchInput placeholder={placeholder} size={size} />
    </form>
  );
}
