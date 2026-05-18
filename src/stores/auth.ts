import { jwtDecode } from 'jwt-decode';
import { create, type StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';

type State = {
  token: string | null;
  refreshToken: string | null;
  /** Wall-clock session end from JWT `exp` (refresh preferred). Opaque refresh: seeded from access `exp` at login / refresh rotation only. */
  sessionAbsoluteExpiresAt: number | null;
  user: Record<string, any> | null;
  isAuthenticated: boolean;
  role: Record<string, any> | null;
  permissions: Array<{ permission: string }> | null;
};

type Actions = {
  reset: () => void;
  authenticate: (details: {
    token: string;
    refreshToken?: string | null;
    role?: Record<string, any> | null;
    permissions?: Array<{ permission: string }> | null;
  }) => void;
  getToken: () => State['token'];
  getRefreshToken: () => State['refreshToken'];
  setToken: (newToken: string) => void;
  setRefreshToken: (newToken: string | null) => void;
  logout: () => void;
};

const decodeUser = (token: string | null) => {
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

const initialState: State = {
  token: null,
  refreshToken: null,
  sessionAbsoluteExpiresAt: null,
  isAuthenticated: false,
  user: null,
  role: null,
  permissions: null,
};

function jwtExpiryMs(jwt: string | null): number | null {
  if (!jwt) return null;
  try {
    const payload = jwtDecode<{ exp?: number }>(jwt);
    return payload.exp != null ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

const authStore: StateCreator<State & Actions> = (set, get) => ({
  ...initialState,
  reset: () => set(initialState),
  authenticate: ({ token, refreshToken, role, permissions }) => {
    const currentState = get();
    const nextRefreshToken =
      refreshToken !== undefined
        ? (refreshToken ?? null)
        : currentState.refreshToken;

    const oldRefresh = currentState.refreshToken;
    const refreshTokenChanged =
      (nextRefreshToken ?? '') !== (oldRefresh ?? '') &&
      !(oldRefresh == null && nextRefreshToken == null);

    const refreshJwtExp = jwtExpiryMs(nextRefreshToken);
    const accessJwtExp = jwtExpiryMs(token);

    let sessionAbsoluteExpiresAt = currentState.sessionAbsoluteExpiresAt;

    if (refreshJwtExp != null) {
      sessionAbsoluteExpiresAt = refreshJwtExp;
    } else if (refreshTokenChanged && accessJwtExp != null) {
      sessionAbsoluteExpiresAt = accessJwtExp;
    } else if (sessionAbsoluteExpiresAt == null && accessJwtExp != null) {
      sessionAbsoluteExpiresAt = accessJwtExp;
    }

    set({
      user: decodeUser(token),
      token,
      refreshToken: nextRefreshToken,
      role: role ?? currentState.role,
      permissions: permissions ?? currentState.permissions,
      isAuthenticated: true,
      sessionAbsoluteExpiresAt,
    });
  },
  logout: () => {
    set({
      token: null,
      refreshToken: null,
      sessionAbsoluteExpiresAt: null,
      user: null,
      role: null,
      permissions: null,
      isAuthenticated: false,
    });
  },
  getToken: () => get().token,
  getRefreshToken: () => get().refreshToken,
  setToken: (newToken: string) =>
    set({
      token: newToken,
      user: decodeUser(newToken),
    }),
  setRefreshToken: (newToken: string | null) => set({ refreshToken: newToken }),
});

const useAuthStore = create(
  persist(authStore, {
    name: 'dashqard-admin-auth-store',
  })
);

export { useAuthStore };
