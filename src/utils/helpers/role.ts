import type { MenuItem } from '@/types';
import type { PermissionType } from '@/types/roles';

/**
 * Extracts permissions from roles or API response structure
 * Handles both:
 * 1. IAdmin roles structure: roles[].permissions (array of permission strings)
 * 2. API verify-login-token response: data.permissions.permissions (array of permission objects with .permission field)
 */
export function getAllAdminPermissions(
  roles?: any,
  apiPermissions?: Array<{ permission: string }>
): string[] {
  // If API permissions are provided (from verify-login-token response)
  if (apiPermissions && Array.isArray(apiPermissions)) {
    return apiPermissions.map((p) => p.permission);
  }

  // Handle roles structure
  if (!roles) return [];

  // Handle both single role and array of roles
  const rolesArray = Array.isArray(roles) ? roles : [roles];

  return rolesArray.flatMap((role) => {
    if (!role?.permissions) return [];

    // Handle both string array and object array with permission field
    return role.permissions.map((perm: any) =>
      typeof perm === 'string' ? perm : perm.permission || perm
    );
  });
}

export function getFirstRouteFromUser(
  menuItems: MenuItem[],
  userPermissions: PermissionType[]
) {
  // Normalize permissions for comparison (handle both formats)
  const normalizedPermissions = userPermissions.map((p) => p.toLowerCase());

  // 1. Check if user has 'Dashboard view' permission (legacy format)
  // or any dashboard-related permission (new format)
  const hasDashboardView =
    normalizedPermissions.includes('dashboard view') ||
    normalizedPermissions.some((p) => p.includes('dashboard'));

  if (hasDashboardView) {
    // Find and return the Dashboard route
    for (const section of menuItems) {
      for (const item of section.children) {
        const itemPermission = item.permission?.toLowerCase();
        if (
          itemPermission === 'dashboard view' ||
          itemPermission?.includes('dashboard')
        ) {
          return item.path;
        }
      }
    }
  }

  // 2. If no Dashboard view, get the first "view" permission from the user
  // Handle both "Module view" and "category:view" formats
  const firstViewPermission = userPermissions.find((p) => {
    const lower = p.toLowerCase();
    return lower.endsWith(':view') || lower.endsWith(' view');
  });

  if (!firstViewPermission) return null;

  // 3. Search the menu for the matching permission
  for (const section of menuItems) {
    for (const item of section.children) {
      const itemPermission = item.permission?.toLowerCase();
      const firstViewLower = firstViewPermission.toLowerCase();

      if (
        itemPermission === firstViewLower ||
        (itemPermission && firstViewLower.includes(itemPermission)) ||
        (itemPermission &&
          itemPermission.includes(firstViewLower.split(':')[0]))
      ) {
        return item.path;
      }
    }
  }

  return null;
}
