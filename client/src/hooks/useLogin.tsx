import { useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { login as loginAPI } from '@/services/apiAuth';

export function useLogin() {
  const navigate = useNavigate();

  const {
    mutate: login,
    isPending,
    error,
  } = useMutation({
    mutationFn: loginAPI,
    onSuccess: () => navigate('/dashboard'),
  });
  return { login, isPending, error };
}
