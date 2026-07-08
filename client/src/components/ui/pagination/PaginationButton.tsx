import clsx from 'clsx';
import { Link } from 'react-router';

import Icon from '../icons/Icon';

interface PaginationButtonProps {
  href: string;
  page: 'prev' | 'next' | number;
  active?: boolean;
  disabled?: boolean;
}

const styles = {
  default:
    'hover:bg-slate-200/50 dark:hover:bg-slate-600/30 bg-slate-100 dark:bg-slate-700 text-slate-700',
  active: `bg-blue-500 cursor-default pointer-events-none
  dark:bg-blue-700 text-slate-200`,
  disable: `cursor-default dark:border-slate-700 border-slate-300
  text-slate-300 dark:text-slate-700 pointer-events-none`,
};

export default function PaginationButton({
  href,
  page,
  active,
  disabled,
}: PaginationButtonProps) {
  return (
    <Link
      to={disabled || active ? '#' : href}
      aria-disabled={disabled}
      tabIndex={disabled || active ? -1 : 0}
      className={clsx(
        'flex h-7 w-7 items-center justify-center p-1 font-semibold',
        'outline-input rounded-md border text-sm select-none',
        !active && !disabled && styles.default,
        active ? styles.active : '',
        disabled
          ? styles.disable
          : 'border-slate-300 dark:border-slate-500 dark:text-slate-300',
      )}
    >
      {typeof page === 'string' ? (
        <Icon
          size={16}
          name={page === 'prev' ? 'chevron-left' : 'chevron-right'}
        />
      ) : (
        page
      )}
    </Link>
  );
}
