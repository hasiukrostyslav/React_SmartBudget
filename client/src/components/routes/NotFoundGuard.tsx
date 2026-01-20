import { Navigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'react-router';

export default function NotFoundGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const { session, isFetching } = useAuth();

  if (!session && !isFetching) return <Navigate to="/auth/login" replace />;

  if (session && location.pathname === '/') return <Navigate to="/dashboard" />;

  if (session && location.pathname !== '/') return children;
}
