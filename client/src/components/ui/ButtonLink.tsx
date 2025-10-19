import { Link } from 'react-router';

interface ButtonLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function ButtonLink({ href, children }: ButtonLinkProps) {
  return (
    <Link
      className="outline-round-md rounded-2xl border-2 border-slate-50 bg-slate-300 px-3 py-1 text-sm hover:bg-slate-200 dark:border-slate-400 dark:bg-slate-900 dark:text-slate-400 hover:dark:border-slate-500 hover:dark:bg-slate-900 hover:dark:text-slate-500"
      to={href}
    >
      {children}
    </Link>
  );
}
