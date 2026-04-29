import { useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';

import { useAuthStore } from '@/stores';
import { useToast } from './useToast';
import { refreshToken as refreshTokenService } from '@/features/services';

type JwtPayload = {
  exp?: number;
};
const REFRESH_THRESHOLD_MS = 60_000; // refresh 1 minute before expiry

export function useAutoRefreshToken() {
  const token = useAuthStore((state) => state.token);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const authenticate = useAuthStore((state) => state.authenticate);
  const logout = useAuthStore((state) => state.logout);
  const toast = useToast();
  const refreshPromiseRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    let refreshTimeoutId: number | null = null;
    let sessionTimeoutId: number | null = null;

    const safeDecode = (jwtToken: string): JwtPayload | null => {
      try {
        const decodedPayload = jwtDecode<JwtPayload>(jwtToken);
        return decodedPayload;
      } catch (error) {
        console.error('[useAutoRefreshToken] failed to decode token', error);
        return null;
      }
    };

    const forceLogout = () => {
      logout();
      toast.error('Session expired. Please log in again.');
    };

    const runRefresh = async (activeRefreshToken: string) => {
      try {
        const response = await refreshTokenService(activeRefreshToken);
        const nextAccessToken = response?.data?.accessToken;
        const nextRefreshToken = response?.data?.refreshToken;

        if (!nextAccessToken) {
          throw new Error('Unable to refresh access token');
        }

        // Preserve existing role and permissions when refreshing token
        const currentState = useAuthStore.getState();
        authenticate({
          token: nextAccessToken,
          refreshToken: nextRefreshToken,
          role: currentState.role,
          permissions: currentState.permissions,
        });
      } catch (error) {
        console.error('Failed to refresh token', error);
        forceLogout();
      }
    };

    const scheduleSessionExpiryLogout = () => {
      // Prefer refresh token expiry as overall session lifetime.
      // If unavailable, fall back to access token expiry.
      const refreshDecoded = refreshToken ? safeDecode(refreshToken) : null;
      const accessDecoded = safeDecode(token);
      const expirySeconds = refreshDecoded?.exp ?? accessDecoded?.exp;
      if (!expirySeconds) return;

      const expiresAt = expirySeconds * 1000;
      const delay = expiresAt - Date.now();
      if (delay <= 0) {
        forceLogout();
        return;
      }

      sessionTimeoutId = window.setTimeout(() => {
        forceLogout();
      }, delay);
    };

    const scheduleRefresh = () => {
      if (!refreshToken) return;
      const decoded = safeDecode(token);
      if (!decoded?.exp) {
        return;
      }
      const expiresAt = decoded.exp * 1000;
      const refreshAt = expiresAt - REFRESH_THRESHOLD_MS;
      const delay = refreshAt - Date.now();

      const trigger = () => {
        if (!refreshPromiseRef.current) {
          refreshPromiseRef.current = runRefresh(refreshToken);
        }
        refreshPromiseRef.current.finally(() => {
          refreshPromiseRef.current = null;
        });
      };

      if (delay <= 0) {
        trigger();
        return;
      }

      refreshTimeoutId = window.setTimeout(trigger, delay);
    };

    scheduleSessionExpiryLogout();
    scheduleRefresh();

    return () => {
      if (refreshTimeoutId) {
        window.clearTimeout(refreshTimeoutId);
      }
      if (sessionTimeoutId) {
        window.clearTimeout(sessionTimeoutId);
      }
    };
  }, [token, refreshToken, authenticate, logout, toast]);
}
