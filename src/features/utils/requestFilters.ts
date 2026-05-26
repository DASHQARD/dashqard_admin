type RequestWithUserType = { user_type?: string | null };

function normalizeUserType(userType: unknown): string {
  return String(userType ?? '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_');
}

function isCorporateType(type: string): boolean {
  return type.includes('corporate');
}

function isSuperAdminType(type: string): boolean {
  return (
    type.includes('super_admin') || type === 'superadmin' || type === 'super_admin'
  );
}

/**
 * Vendor / branch admin requests from GET /requests/admin.
 * Includes vendor, branch, user, etc. Excludes corporate and super admin types.
 */
export function isVendorRequest(request: RequestWithUserType): boolean {
  const type = normalizeUserType(request.user_type);
  if (!type) return false;
  if (isCorporateType(type)) return false;
  if (isSuperAdminType(type)) return false;
  return true;
}

export function isPendingRequestStatus(status: unknown): boolean {
  const value = String(status ?? '').toLowerCase();
  return value === 'pending' || value.includes('awaiting');
}

/** Corporate requests (includes `corporate` and `corporate super admin`). */
export function isCorporateRequest(request: RequestWithUserType): boolean {
  const type = normalizeUserType(request.user_type);
  if (!type) return false;
  return isCorporateType(type);
}
