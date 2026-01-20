import { Navigate, useLocation } from 'react-router';
import { useAuth } from '@/hooks/useAuth';

export default function PublicRoutes({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const { session } = useAuth();

  if (session && location.pathname.startsWith('/auth'))
    return <Navigate to="/dashboard" replace />;

  if (!session && /^\/auth\/?$/.test(location.pathname))
    return <Navigate to="/auth/login" replace />;

  return children;
}
