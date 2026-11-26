import clsx from 'clsx';
import { Link } from 'react-router';

interface InlineLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function InlineLink({
  href,
  children,
  className,
}: InlineLinkProps) {
  return (
    <Link
      className={clsx(
        'outline-round-sm text-primary hover:text-primary-hover dark:text-dark-link',
        'text-xs font-semibold',
        className,
      )}
      to={href}
    >
      {children}
    </Link>
  );
}
