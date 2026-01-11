import { Link } from 'react-router';
import clsx from 'clsx';

interface ButtonLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function ButtonLink({ href, children }: ButtonLinkProps) {
  return (
    <Link
      className={clsx(
        'outline-round-md rounded-lg border-2 px-4 py-2 text-base',
        'bg-slate-300 hover:bg-slate-200 dark:bg-slate-900 hover:dark:bg-slate-900',
        'border-slate-50 dark:border-slate-400 hover:dark:border-slate-500',
        'dark:text-slate-400 hover:dark:text-slate-500',
      )}
      to={href}
    >
      {children}
    </Link>
  );
}
