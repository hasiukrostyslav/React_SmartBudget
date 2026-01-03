import { useQuery } from '@tanstack/react-query';
import { getSession } from '@/services/apiAuth';

export function useAuth() {
  const {
    data: session,
    error,
    isFetching,
  } = useQuery({ queryKey: ['session'], queryFn: getSession, retry: false });

  return { session, isFetching, error };
}
