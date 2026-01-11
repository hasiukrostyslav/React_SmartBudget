import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router';

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, isFetching } = useAuth();

  if (session) return children;

  if (!isFetching) return <Navigate to="/auth/login" replace />;

  return null;
}
