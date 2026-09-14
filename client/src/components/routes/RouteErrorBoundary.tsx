import { useLocation } from 'react-router';

import ErrorBoundary from '@/components/ui/feedback/ErrorBoundary';

// Keyed on the path, so a crash on one page doesn't follow the user to the next.
export default function RouteErrorBoundary({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback: React.ReactNode;
}) {
  const { pathname } = useLocation();

  return (
    <ErrorBoundary resetKey={pathname} fallback={fallback}>
      {children}
    </ErrorBoundary>
  );
}
