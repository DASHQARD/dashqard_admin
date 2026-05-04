import { useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';

import { useAuthStore } from '@/stores';
import { SESSION_IDLE_TIMEOUT_MS } from '@/utils/constants';
import { useToast } from './useToast';
import { refreshToken as refreshTokenService } from '@/features/services';

type JwtPayload = {
  exp?: number;
};
const REFRESH_THRESHOLD_MS = 60_000; // refresh 1 minute before expiry

const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'click', 'touchstart'] as const;

export function useAutoRefreshToken() {
  const token = useAuthStore((state) => state.token);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const sessionAbsoluteExpiresAt = useAuthStore(
    (state) => state.sessionAbsoluteExpiresAt
  );
  const authenticate = useAuthStore((state) => state.authenticate);
  const reset = useAuthStore((state) => state.reset);
  const toast = useToast();
  const refreshPromiseRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    let refreshTimeoutId: ReturnType<typeof window.setTimeout> | null = null;
    let absoluteTimeoutId: ReturnType<typeof window.setTimeout> | null = null;
    let idleTimeoutId: ReturnType<typeof window.setTimeout> | null = null;

    const safeDecode = (jwtToken: string): JwtPayload | null => {
      try {
        return jwtDecode<JwtPayload>(jwtToken);
      } catch (error) {
        console.error('[useAutoRefreshToken] failed to decode token', error);
        return null;
      }
    };

    const forceLogout = (reason: 'session' | 'idle') => {
      reset();
      if (reason === 'idle') {
        toast.error('You were signed out due to inactivity.');
      } else {
        toast.error('Your session has expired. Please sign in again.');
      }
      const path = window.location.pathname;
      if (!path.includes('auth')) {
        window.location.assign('/auth/login');
      }
    };

    const runRefresh = async (activeRefreshToken: string) => {
      try {
        const response = await refreshTokenService(activeRefreshToken);
        const nextAccessToken = response?.data?.accessToken;
        const nextRefreshToken = response?.data?.refreshToken;

        if (!nextAccessToken) {
          throw new Error('Unable to refresh access token');
        }

        const currentState = useAuthStore.getState();
        authenticate({
          token: nextAccessToken,
          refreshToken: nextRefreshToken,
          role: currentState.role,
          permissions: currentState.permissions,
        });
      } catch (error) {
        console.error('Failed to refresh token', error);
        forceLogout('session');
      }
    };

    const scheduleAbsoluteLogout = () => {
      if (absoluteTimeoutId) {
        window.clearTimeout(absoluteTimeoutId);
        absoluteTimeoutId = null;
      }
      const deadline = useAuthStore.getState().sessionAbsoluteExpiresAt;
      if (deadline == null) return;

      const delay = deadline - Date.now();
      if (delay <= 0) {
        forceLogout('session');
        return;
      }

      absoluteTimeoutId = window.setTimeout(() => {
        forceLogout('session');
      }, delay);
    };

    const clearIdle = () => {
      if (idleTimeoutId) {
        window.clearTimeout(idleTimeoutId);
        idleTimeoutId = null;
      }
    };

    const armIdle = () => {
      clearIdle();
      if (SESSION_IDLE_TIMEOUT_MS <= 0) return;
      idleTimeoutId = window.setTimeout(() => {
        forceLogout('idle');
      }, SESSION_IDLE_TIMEOUT_MS);
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

    scheduleAbsoluteLogout();
    scheduleRefresh();

    let removeActivityListeners: (() => void) | undefined;
    if (SESSION_IDLE_TIMEOUT_MS > 0) {
      armIdle();
      const onActivity = () => {
        armIdle();
      };
      ACTIVITY_EVENTS.forEach((evt) => {
        window.addEventListener(evt, onActivity, { passive: true });
      });
      removeActivityListeners = () => {
        ACTIVITY_EVENTS.forEach((evt) => {
          window.removeEventListener(evt, onActivity);
        });
      };
    }

    return () => {
      if (refreshTimeoutId) {
        window.clearTimeout(refreshTimeoutId);
      }
      if (absoluteTimeoutId) {
        window.clearTimeout(absoluteTimeoutId);
      }
      clearIdle();
      removeActivityListeners?.();
    };
  }, [
    token,
    refreshToken,
    sessionAbsoluteExpiresAt,
    authenticate,
    reset,
    toast,
  ]);
}
