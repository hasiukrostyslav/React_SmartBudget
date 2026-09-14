import { signOut as signOutAPI } from '@/services/apiAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

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
      // Drop everything, not just the session: cached transactions belong to
      // this user, and the next person to sign in on this tab must not see
      // them. Removing the session also stops ProtectedRoute rendering stale
      // authenticated state if the user navigates back through history.
      queryClient.clear();
      navigate('/auth/login');
    },
  });
  return { signOut, isPending, error };
}
