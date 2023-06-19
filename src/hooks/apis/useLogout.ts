import { useMutation } from '@tanstack/react-query';

import { useAuthContext } from '@/context/AuthContext';
import type { AuthToken } from '@/hooks/apis/useLogin';
import httpRequest from '@/utils/api/httpRequest';
import { getStorageItem, removeStorageItem } from '@/utils/storage';

const useLogout = () => {
  const { setIsAuthenticated } = useAuthContext();

  const refreshToken = getStorageItem<AuthToken>('user')?.refresh_token ?? '';
  const mutation = useMutation({
    mutationFn: async () => {
      await httpRequest.get('/auth/logout', {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });
    },
    onMutate: () => {
      removeStorageItem('user');
      setIsAuthenticated(false);
    },
  });

  return { logout: mutation.mutate };
};

export default useLogout;
