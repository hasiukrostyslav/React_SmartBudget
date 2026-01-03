import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router';

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, isFetching } = useAuth();

  if (!session && !isFetching) return <Navigate to="/auth/login" replace />;

  if (session && !isFetching) return children;
}
