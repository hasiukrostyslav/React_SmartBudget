import { useLocation } from 'react-router';

import ErrorBoundary from '@/components/ui/feedback/ErrorBoundary';

// Keyed on the history entry, not the path: a crash on one page doesn't follow
// the user to the next, and clicking the current page's link again retries it.
export default function RouteErrorBoundary({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback: React.ReactNode;
}) {
  const { key } = useLocation();

  return (
    <ErrorBoundary resetKey={key} fallback={fallback}>
      {children}
    </ErrorBoundary>
  );
}
