import { useAuthStore } from '@/stores';
import { ROUTES } from '@/utils/constants';

let redirectScheduled = false;

/** Clears persisted auth and sends the user to login (full navigation). */
export function clearAuthSessionAndRedirect() {
  useAuthStore.getState().reset();

  if (typeof window === 'undefined') return;

  const path = window.location.pathname;
  if (path.includes('auth')) return;

  if (!redirectScheduled) {
    redirectScheduled = true;
    window.location.assign(ROUTES.IN_APP.AUTH.LOGIN);
  }
}
