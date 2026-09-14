import { getSession } from '@/services/apiAuth';
import { useQuery } from '@tanstack/react-query';

export function useAuth() {
  const {
    data: session,
    error,
    isFetching,
  } = useQuery({
    queryKey: ['session'],
    queryFn: getSession,
    retry: false,
    // Sign-in and sign-out invalidate or remove this query explicitly, so it
    // doesn't need re-checking on every mount and window focus.
    staleTime: 5 * 60 * 1000,
  });

  return { session, isFetching, error };
}
