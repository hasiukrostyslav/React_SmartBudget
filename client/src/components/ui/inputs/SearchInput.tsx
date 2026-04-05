import clsx from 'clsx';
import Icon from '../Icon';

interface SearchInputProps {
  placeholder: string;
  size: 'sm' | 'md' | 'lg';
  ref?: React.Ref<HTMLInputElement>;
}

const sizes = {
  sm: { p: 'py-1', bottom: 'bottom-1.5' },
  md: { p: 'py-1.5', bottom: 'bottom-2' },
  lg: { p: 'py-2', bottom: 'bottom-2.5' },
};

export default function SearchInput({
  placeholder,
  size,
  ref,
  ...props
}: SearchInputProps) {
  return (
    <>
      <input
        {...props}
        ref={ref}
        name="search"
        type="text"
        placeholder={placeholder}
        autoComplete="off"
        className={clsx(
          'outline-input pr-10 pl-4 text-sm tracking-wider text-slate-700',
          'placeholder:text-slate-500 dark:text-slate-100 dark:placeholder:text-slate-300',
          sizes[size].p,
        )}
      />
      <button
        type="submit"
        className={clsx(
          'outline-round-sm absolute right-3',
          sizes[size].bottom,
        )}
      >
        <Icon
          className="text-slate-400 dark:text-slate-400"
          size={16}
          name="search"
        />
      </button>
    </>
  );
}
