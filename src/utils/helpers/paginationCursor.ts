type PaginationCursorPayload = {
  p?: string;
  s?: string | number;
};

function decodeBase64Url(value: string): string {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  return atob(padded);
}

function isIsoDateCursor(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value);
}

/**
 * Corporates `after` must be an ISO-8601 timestamp. The API still returns a
 * base64url JSON cursor in `pagination.next` (`{ p, s }`) like other lists.
 */
export function toCorporatesAfterParam(
  cursor?: string | null
): string | undefined {
  if (!cursor?.trim()) return undefined;

  const trimmed = cursor.trim();
  if (isIsoDateCursor(trimmed)) return trimmed;

  try {
    const parsed = JSON.parse(
      decodeBase64Url(trimmed)
    ) as PaginationCursorPayload;
    if (parsed.p && isIsoDateCursor(parsed.p)) {
      return parsed.p;
    }
  } catch {
    // Opaque cursor — corporates does not accept this format.
  }

  return undefined;
}
