import { useMutation } from '@tanstack/react-query';

import { useAuthContext } from '@/context/AuthContext';
import httpRequest from '@/utils/api/httpRequest';
import { setStorageItem } from '@/utils/storage';

interface LoginRequestBody {
  email: string;
  password: string;
}

interface LoginRequest extends LoginRequestBody {}

export interface AuthToken {
  access_token: string;
  refresh_token: string;
}

async function login({ email, password }: LoginRequest) {
  const { data } = await httpRequest.post<AuthToken>('/auth/authenticate', { email: email, password: password });
  return data;
}

interface UseLoginMutationProps {
  onError?: (error: unknown) => void;
}

const useLogin = ({ onError }: UseLoginMutationProps) => {
  const { setIsAuthenticated } = useAuthContext();

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (token) => {
      setStorageItem<AuthToken>('user', token);
      setIsAuthenticated(true);
    },
    onError,
  });

  return { isLoading: mutation.isLoading, login: mutation.mutate };
};

export default useLogin;
