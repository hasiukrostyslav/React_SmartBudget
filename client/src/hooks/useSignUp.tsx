import { useNavigate } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signUp as signUpAPI } from '@/services/apiAuth';

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
      queryClient.invalidateQueries({ queryKey: ['session'] });
      navigate('/dashboard');
    },
  });

  return { signUp, error, isPending };
}
