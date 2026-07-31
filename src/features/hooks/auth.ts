import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';

import { useToast } from '@/hooks';
import { useAuthStore } from '@/stores';
import { ROUTES } from '@/utils/constants';

import {
  adminLogin,
  changeAdminPassword,
  forgotAdminPassword,
  resetAdminPassword,
  verifyLoginToken,
} from '../services';
import type { VerifyLoginTokenResponse } from '@/types/admin';
import { refreshToken } from '@/services/files';
import { resetAuthInterceptorState } from '@/libs/axios';
import { useQueryClient } from '@tanstack/react-query';

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
        } else if (error.status === 429) {
          toast.info(
            error.message || 'Too many attempts, please try again later.'
          );
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

  function useForgotAdminPassword() {
    return useMutation({
      mutationFn: forgotAdminPassword,
      onSuccess: (response: any) => {
        toast.success(
          response?.message ||
            "If an account exists for that address, we've sent a reset link. Check your inbox — you can request another link in 15 minutes."
        );
      },
      onError: (err: any) => {
        if (err?.status === 429) {
          toast.info(
            err?.message || 'Too many attempts, please try again later.'
          );
          return;
        }
        toast.error(err?.message || 'Failed to request password reset');
      },
    });
  }

  function useResetAdminPassword() {
    return useMutation({
      mutationFn: resetAdminPassword,
      onSuccess: (response: any) => {
        toast.success(
          response?.message || 'Password reset successfully. Please sign in.'
        );
        navigate(ROUTES.IN_APP.ADMIN.AUTH.LOGIN);
      },
      onError: (err: any) => {
        if (err?.status === 429) {
          toast.info(
            err?.message || 'Too many attempts, please try again later.'
          );
          return;
        }
        toast.error(err?.message || 'Failed to reset password');
      },
    });
  }

  function useChangeAdminPassword() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: changeAdminPassword,
      onSuccess: (response: any) => {
        toast.success(
          response?.message || 'Password changed. Please sign in again.'
        );
        // Refresh token is revoked server-side — end session predictably
        resetAuthInterceptorState();
        useAuthStore.getState().logout();
        queryClient.clear();
        window.location.href = ROUTES.IN_APP.ADMIN.AUTH.LOGIN;
      },
      onError: (err: any) => {
        if (err?.status === 429) {
          toast.info(
            err?.message ||
              'Too many password change attempts, please try again later.'
          );
          return;
        }
        // Wrong current password stays as field-level / toast; other 401s → session
        if (
          err?.status === 401 &&
          err?.message !== 'Current password is incorrect'
        ) {
          toast.error(err?.message || 'Session expired. Please log in again.');
          resetAuthInterceptorState();
          useAuthStore.getState().logout();
          queryClient.clear();
          window.location.href = ROUTES.IN_APP.ADMIN.AUTH.LOGIN;
          return;
        }
        toast.error(err?.message || 'Failed to change password');
      },
    });
  }

  return {
    useAdminLoginMutation,
    tokenExpired,
    setTokenExpired,
    useVerifyLoginTokenService,
    useRefreshTokenService,
    useForgotAdminPassword,
    useResetAdminPassword,
    useChangeAdminPassword,
  };
}
