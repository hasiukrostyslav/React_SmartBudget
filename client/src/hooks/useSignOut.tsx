import { useNavigate } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signOut as signOutAPI } from '@/services/apiAuth';

export function useSignOut() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    mutate: signOut,
    isPending,
    error,
  } = useMutation({
    mutationFn: signOutAPI,
    onSuccess: () => {
      // Remove cached session immediately so ProtectedRoute can't render
      // stale authenticated state if the user navigates back via browser history
      queryClient.removeQueries({ queryKey: ['session'] });
      navigate('/auth/login');
    },
  });
  return { signOut, isPending, error };
}
