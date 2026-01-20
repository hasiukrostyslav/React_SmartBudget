import { useAuth } from '@/hooks/useAuth';
import { Navigate, useLocation } from 'react-router';

export default function ProtectedRoutes({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const { session } = useAuth();

  if (!session) return <Navigate to="/auth/login" replace />;

  if (session && location.pathname === '/')
    return <Navigate to="/dashboard" replace />;

  if (session) return children;
}
