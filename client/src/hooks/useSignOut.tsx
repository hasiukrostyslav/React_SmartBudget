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
      navigate('/auth/login');
      queryClient.setQueryData(['session'], null);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['session'] }),
  });
  return { signOut, isPending, error };
}
