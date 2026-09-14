import { signUp as signUpAPI } from '@/services/apiAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

export function useSignUp() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    mutate: signUp,
    isPending,
    error,
  } = useMutation({
    mutationFn: signUpAPI,
    onSuccess: () => {
      // A new account starts with nothing cached from whoever used this tab.
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] !== 'session',
      });
      queryClient.invalidateQueries({ queryKey: ['session'] });
      navigate('/dashboard');
    },
  });

  return { signUp, error, isPending };
}
