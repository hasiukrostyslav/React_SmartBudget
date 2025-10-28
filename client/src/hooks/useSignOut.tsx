import { useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { signOut as signOutAPI } from '@/services/apiAuth';

export function useSignOut() {
  const navigate = useNavigate();

  const {
    mutate: signOut,
    isPending,
    error,
  } = useMutation({
    mutationFn: signOutAPI,
    onSuccess: () => navigate('/auth/login'),
  });
  return { signOut, isPending, error };
}
