import { Navigate } from 'react-router';

import { useAuth } from '@/hooks/useAuth';

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
