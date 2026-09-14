import { Navigate } from 'react-router';

import { useAuth } from '@/hooks/useAuth';

import Spinner from '@/components/ui/feedback/Spinner';

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, isFetching, error } = useAuth();

  if (session) return children;

  // The check settled without a session, or the check itself failed: either
  // way the dashboard can't be shown.
  if (error || !isFetching) return <Navigate to="/auth/login" replace />;

  // Still checking. Show progress rather than a blank page.
  return (
    <div className="relative h-screen">
      <Spinner title="Checking your session" />
    </div>
  );
}
