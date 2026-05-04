/**
 * Maximum time without user activity before auto-logout (separate from JWT expiry).
 * - Set `VITE_SESSION_IDLE_TIMEOUT_MS` in `.env` to override (milliseconds).
 * - Set to `0` to disable idle logout (JWT / API errors still end the session).
 * - Default: 30 minutes.
 */
export const SESSION_IDLE_TIMEOUT_MS = (() => {
  const raw = import.meta.env.VITE_SESSION_IDLE_TIMEOUT_MS;
  if (raw === '0' || raw === 0) return 0;
  if (raw === '' || raw === undefined) return 30 * 60 * 1000;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : 30 * 60 * 1000;
})();
