import { useNavigate } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login as loginAPI } from '@/services/apiAuth';

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
      // Invalidate so ProtectedRoute gets fresh session data without a double round-trip
      queryClient.invalidateQueries({ queryKey: ['session'] });
      navigate('/dashboard');
    },
  });
  return { login, isPending, error };
}
