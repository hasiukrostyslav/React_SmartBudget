import { Link } from 'react-router';

interface AuthLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function AuthLink({ href, children, className }: AuthLinkProps) {
  return (
    <Link
      className={` text-blue-600 hover:text-blue-500 underline font-bold 
         text-xs ${className} outline-round-sm`}
      to={href}
    >
      {children}
    </Link>
  );
}
