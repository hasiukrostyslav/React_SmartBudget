import { Link } from 'react-router';

interface ButtonLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function ButtonLink({ href, children }: ButtonLinkProps) {
  return (
    <Link
      className="border-2 border-slate-50 dark:border-slate-400 hover:dark:border-slate-500 dark:text-slate-400 hover:dark:text-slate-500 py-1 px-3 rounded-2xl text-sm outline-round-md bg-slate-300 dark:bg-slate-900 hover:dark:bg-slate-900 hover:bg-slate-200"
      to={href}
    >
      {children}
    </Link>
  );
}
