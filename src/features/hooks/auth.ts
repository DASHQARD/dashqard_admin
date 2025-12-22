import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';

import { useToast } from '@/hooks';
import { useAuthStore } from '@/stores';
import { ROUTES } from '@/utils/constants';

import { adminLogin, verifyLoginToken } from '../services';
import type { VerifyLoginTokenResponse } from '@/types/admin';

export function useAuth() {
  const toast = useToast();
  const [tokenExpired, setTokenExpired] = React.useState(false);
  const navigate = useNavigate();

  function useAdminLoginMutation() {
    return useMutation({
      mutationFn: adminLogin,
      onSuccess: (response: { message: string }) => {
        toast.success(response.message);
      },
      onError: (error: { status: number; message: string }) => {
        if (error.status === 401) {
          toast.error(error.message);
        } else {
          toast.error('Login failed. Please try again.');
        }
      },
    });
  }

  function useVerifyLoginTokenService() {
    return useMutation({
      mutationFn: verifyLoginToken,
      onSuccess: (response: VerifyLoginTokenResponse) => {
        useAuthStore.getState().authenticate({
          token: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          role: response.data.permissions.role,
          permissions: response.data.permissions.permissions,
        });

        toast.success('Login successful');
        navigate(ROUTES.IN_APP.DASHBOARD.HOME);
      },
      onError: (error: { status: number; message: string }) => {
        const errorMessage =
          error?.message || 'Verify login OTP failed. Please try again.';
        toast.error(errorMessage);
      },
    });
  }

  return {
    useAdminLoginMutation,
    tokenExpired,
    setTokenExpired,
    useVerifyLoginTokenService,
  };
}
