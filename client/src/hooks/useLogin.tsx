import { login as loginAPI } from '@/services/apiAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    mutate: login,
    isPending,
    error,
  } = useMutation({
    mutationFn: loginAPI,
    onSuccess: () => {
      // Another account may have used this tab without signing out (an expired
      // session, a closed tab restored). Its cached data must not render for
      // this user.
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] !== 'session',
      });
      // Invalidate so ProtectedRoute gets fresh session data without a double round-trip
      queryClient.invalidateQueries({ queryKey: ['session'] });
      navigate('/dashboard');
    },
  });
  return { login, isPending, error };
}
