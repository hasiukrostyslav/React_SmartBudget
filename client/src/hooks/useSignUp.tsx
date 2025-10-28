import { useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { signUp as signUpAPI } from '@/services/apiAuth';

export function useSignUp() {
  const navigate = useNavigate();

  const {
    mutate: signUp,
    isPending,
    error,
  } = useMutation({
    mutationFn: signUpAPI,
    onSuccess: () => navigate('/dashboard'),
  });

  return { signUp, error, isPending };
}
