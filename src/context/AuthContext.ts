import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import constate from 'constate';
import { useEffect, useState } from 'react';

import type { AuthToken } from '@/hooks/apis/useLogin';
import httpRequest from '@/utils/api/httpRequest';
import { getStorageItem, removeStorageItem, setStorageItem } from '@/utils/storage';

export const [AuthContextProvider, useAuthContext] = constate(() => {
  const queryClient = useQueryClient();
  const token = getStorageItem<AuthToken>('user');

  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    const interceptor = httpRequest.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error instanceof AxiosError && error.response?.status === 400) {
          try {
            const originReq = error.config;
            if (originReq && !!token) {
              const { data } = await httpRequest.post<AuthToken>('/auth/new-access-token', {
                refreshToken: token.refresh_token,
              });
              setStorageItem<AuthToken>('user', data);
              originReq.headers.Authorization = `Bearer ${data.access_token}`;
              return await httpRequest.request(originReq);
            }
          } catch (error) {
            removeStorageItem('user');
            setIsAuthenticated(false);
            queryClient.clear();
          }
          return Promise.reject(error);
        }
        return Promise.reject(error);
      },
    );

    return () => {
      httpRequest.interceptors.response.eject(interceptor);
    };
  });

  return { isAuthenticated, setIsAuthenticated };
});
