/** In-memory modal payload cache — never written to the URL or browser history. */
const modalDataCache = new Map<string, unknown>();

export function buildModalCacheKey(
  pathname: string,
  paramName: string,
  modalName: string,
  recordId: string
): string {
  return `${pathname}::${paramName}::${modalName}::${recordId}`;
}

export function setModalDataCache(key: string, data: unknown): void {
  modalDataCache.set(key, data);
}

export function getModalDataCache<T>(key: string): T | undefined {
  return modalDataCache.get(key) as T | undefined;
}

export function deleteModalDataCache(key: string): void {
  modalDataCache.delete(key);
}

export function clearModalDataCacheForPath(pathname: string, paramName: string): void {
  const prefix = `${pathname}::${paramName}::`;
  for (const key of modalDataCache.keys()) {
    if (key.startsWith(prefix)) {
      modalDataCache.delete(key);
    }
  }
}

const RECORD_ID_KEYS = [
  'id',
  'user_id',
  'vendor_id',
  'vendor_account_id',
  'request_id',
  'trans_id',
] as const;

/** Pick a stable record identifier for URL persistence. */
export function extractModalRecordId(data: unknown): string | null {
  if (data == null || typeof data !== 'object') return null;

  const record = data as Record<string, unknown>;
  for (const key of RECORD_ID_KEYS) {
    const value = record[key];
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return String(value);
    }
  }
  return null;
}
