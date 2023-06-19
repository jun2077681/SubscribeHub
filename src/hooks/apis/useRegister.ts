import { useMutation } from '@tanstack/react-query';

import httpRequest from '@/utils/api/httpRequest';

interface RegisterRequestBody {
  email: string;
  password: string;
}

interface RegisterRequest extends RegisterRequestBody {}

interface RegisterResponse {
  success: boolean;
}

async function register({ email, password }: RegisterRequest) {
  const { data } = await httpRequest.post<RegisterResponse>('/auth/register', {
    email: email,
    password: password,
  });
  return data;
}

const useRegister = () => {
  const mutation = useMutation({
    mutationFn: register,
  });

  return { isLoading: mutation.isLoading, register: mutation.mutate };
};

export default useRegister;
