import axios, { AxiosError } from 'axios';

import { useAuthStore } from '@/stores';

import { ENV_VARS, ROUTES } from '../utils/constants';

const instance = axios.create({
  baseURL: `${ENV_VARS.API_BASE_URL}/api/v1`,
});

const CANCELLED_STATUS_CODE = 499;
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

function errorHandler(error: AxiosError) {
  let { status } = error.response || {};
  status = error.code === 'ERR_CANCELED' ? CANCELLED_STATUS_CODE : status;

  if (status === 401 && !window.location.pathname.includes('auth')) {
    const config = error.config as any;
    const refreshToken = useAuthStore.getState().getRefreshToken();

    // Don't retry refresh token endpoint
    if (
      config?.url?.includes('/refresh-token') ||
      config?.url?.includes('/login')
    ) {
      const reset = useAuthStore.getState().reset;
      reset();
      window.location.pathname = ROUTES.IN_APP.AUTH.LOGIN;
      const errorData = error?.response?.data;
      const errorMessage =
        typeof errorData === 'string'
          ? errorData
          : (errorData as any)?.message ||
            error.message ||
            'Session expired. Please log in again.';
      throw {
        status,
        message: errorMessage,
      };
    }

    // If we're already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          config.headers.Authorization = `Bearer ${token}`;
          return instance(config);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    // Try to refresh the token
    if (refreshToken) {
      isRefreshing = true;
      return import('@/features/services')
        .then(({ refreshAdminToken }) =>
          refreshAdminToken({ refresh_token: refreshToken })
        )
        .then((response) => {
          const newAccessToken =
            response?.data?.accessToken ?? response?.accessToken;
          const newRefreshToken =
            response?.data?.refreshToken ??
            response?.refreshToken ??
            refreshToken;

          if (newAccessToken) {
            useAuthStore.getState().authenticate({
              token: newAccessToken,
              refreshToken: newRefreshToken,
            });
            processQueue(null, newAccessToken);
            config.headers.Authorization = `Bearer ${newAccessToken}`;
            isRefreshing = false;
            return instance(config);
          } else {
            throw new Error('Unable to refresh token');
          }
        })
        .catch((refreshError) => {
          processQueue(refreshError, null);
          isRefreshing = false;
          const reset = useAuthStore.getState().reset;
          reset();
          window.location.pathname = ROUTES.IN_APP.AUTH.LOGIN;
          throw refreshError;
        });
    } else {
      // No refresh token, log out
      const reset = useAuthStore.getState().reset;
      reset();
      window.location.pathname = ROUTES.IN_APP.AUTH.LOGIN;
      const errorData = error?.response?.data;
      const errorMessage =
        typeof errorData === 'string'
          ? errorData
          : (errorData as any)?.message ||
            error.message ||
            'Session expired. Please log in again.';
      throw {
        status,
        message: errorMessage,
      };
    }
  }

  const errorData = error?.response?.data;
  const errorMessage =
    typeof errorData === 'string'
      ? errorData
      : (errorData as any)?.message ||
        error.message ||
        'Sorry, an unexpected error occurred.';
  throw {
    status,
    message: errorMessage,
  };
}

instance.interceptors.request.use((request: any) => {
  const headers = request.headers;
  const token = useAuthStore.getState().getToken();
  return {
    ...request,
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

instance.interceptors.response.use(
  (response) => {
    const setToken = useAuthStore.getState().setToken;
    const { data } = response;
    if (data?.token) setToken(data.token);
    return data;
  },
  (error) => errorHandler(error)
);

export { instance as axiosClient };
