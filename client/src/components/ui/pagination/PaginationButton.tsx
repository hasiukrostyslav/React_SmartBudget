import clsx from 'clsx';
import { Link } from 'react-router';

import Icon from '../icons/Icon';

interface PaginationButtonProps {
  href: string;
  page: 'prev' | 'next' | number;
  active?: boolean;
  disable?: boolean;
}

const styles = {
  default: 'hover:bg-blue-200/50 dark:hover:bg-slate-600/30',
  active: `bg-blue-300/50 cursor-default pointer-events-none
  dark:bg-slate-600`,
  disable: `cursor-default dark:border-slate-700 border-slate-300
  text-slate-300 dark:text-slate-700 pointer-events-none`,
};

export default function PaginationButton({
  href,
  page,
  active,
  disable,
}: PaginationButtonProps) {
  return (
    <Link
      to={disable || active ? '#' : href}
      aria-disabled={disable}
      tabIndex={disable || active ? -1 : 0}
      className={clsx(
        'flex h-7 w-7 items-center justify-center p-1',
        'outline-input rounded-md border text-sm select-none',
        !active && !disable && styles.default,
        active ? styles.active : '',
        disable
          ? styles.disable
          : 'border-blue-300 text-slate-700 dark:border-slate-500 dark:text-slate-300',
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
