import { useLocation } from 'react-router';

import ErrorBoundary from '@/components/ui/feedback/ErrorBoundary';

// Keyed on the history entry, not the path: a crash on one page doesn't follow
// the user to the next, and clicking the current page's link again re-renders
// it, which recovers from a render error. A page chunk that failed to load
// stays failed (React.lazy caches the rejection); only the fallback's Reload
// button fixes that.
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
