import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';

import { useToast } from '@/hooks';
import { useAuthStore } from '@/stores';
import { ROUTES } from '@/utils/constants';

import { adminLogin, verifyLoginToken } from '../services';
import type { VerifyLoginTokenResponse } from '@/types/admin';
import { refreshToken } from '@/services/files';

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
    return useMutation<
      VerifyLoginTokenResponse,
      { status: number; message: string },
      { session_id: string; token: string }
    >({
      mutationFn: verifyLoginToken,
      onSuccess: (response) => {
        const { data } = response;
        useAuthStore.getState().authenticate({
          token: data.accessToken,
          refreshToken: data.refreshToken,
          role: data.admin ?? null,
          permissions: Array.isArray(data.permissions)
            ? data.permissions
            : null,
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

  function useRefreshTokenService() {
    return useMutation({
      mutationFn: async (refreshTokenValue: string) => {
        const response = await refreshToken(refreshTokenValue);
        return (response as any).data as {
          message?: string;
          tokens?: { accessToken: string; refreshToken: string };
          accessToken?: string;
          refreshToken?: string;
        };
      },
      onSuccess: (response: {
        message?: string;
        tokens?: { accessToken: string; refreshToken: string };
        accessToken?: string;
        refreshToken?: string;
      }) => {
        const accessToken =
          response?.tokens?.accessToken ?? response?.accessToken ?? null;
        const nextRefreshToken =
          response?.tokens?.refreshToken ?? response?.refreshToken ?? null;
        if (accessToken) {
          // Preserve existing role and permissions when refreshing token
          const currentState = useAuthStore.getState();
          useAuthStore.getState().authenticate({
            token: accessToken,
            refreshToken:
              nextRefreshToken ?? useAuthStore.getState().getRefreshToken(),
            role: currentState.role,
            permissions: currentState.permissions,
          });
        }
        if (response?.message) {
          toast.success(response.message);
        }
        navigate(ROUTES.IN_APP.DASHBOARD.HOME);
      },
      onError: (err: { status: number; message: string }) => {
        toast.error(err.message);
      },
    });
  }

  return {
    useAdminLoginMutation,
    tokenExpired,
    setTokenExpired,
    useVerifyLoginTokenService,
    useRefreshTokenService,
  };
}
