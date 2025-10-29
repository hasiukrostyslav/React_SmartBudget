import { Navigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';

export default function RedirectRoute() {
  const { session, isFetching } = useAuth();

  if (session && !isFetching) return <Navigate to="/dashboard" replace />;

  if (!session && !isFetching) return <Navigate to="/auth/login" replace />;
}
