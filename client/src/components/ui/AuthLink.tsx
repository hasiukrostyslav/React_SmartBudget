import { Link } from 'react-router';

interface AuthLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function AuthLink({ href, children, className }: AuthLinkProps) {
  return (
    <Link
      className={`text-xs font-bold text-blue-600 underline hover:text-blue-500 ${className} outline-round-sm`}
      to={href}
    >
      {children}
    </Link>
  );
}
