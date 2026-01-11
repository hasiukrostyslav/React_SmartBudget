import { Navigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';

export default function RedirectRoute() {
  const { session, isFetching } = useAuth();

  if (isFetching) return null;

  if (session) return <Navigate to="/dashboard" replace />;

  return <Navigate to="/auth/login" replace />;
}
