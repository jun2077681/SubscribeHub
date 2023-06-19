import axios from 'axios';
import qs from 'qs';

import type { AuthToken } from '@/hooks/apis/useLogin';
import { getStorageItem } from '@/utils/storage';

const httpRequest = axios.create({
  baseURL: 'http://localhost:8080/api/',
  withCredentials: true,
});

httpRequest.interceptors.request.use(function (config) {
  const user = getStorageItem<AuthToken>('user');
  if (user) {
    config.headers.Authorization = `Bearer ${user.access_token}`;
  }

  return config;
});

httpRequest.defaults.paramsSerializer = (params) => {
  return qs.stringify(params);
};

export default httpRequest;
