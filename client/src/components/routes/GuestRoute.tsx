import { Navigate } from 'react-router';

import { useAuth } from '@/hooks/useAuth';

export default function GuestRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = useAuth();

  if (session) return <Navigate to="/dashboard" replace />;

  return children;
}
