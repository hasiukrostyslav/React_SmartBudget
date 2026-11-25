import { Link } from 'react-router';

interface AuthLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function AuthLink({ href, children, className }: AuthLinkProps) {
  return (
    <Link
      className={`outline-round-sm text-primary hover:text-primary-hover text-xs font-semibold ${className}`}
      to={href}
    >
      {children}
    </Link>
  );
}
