import type { IAdmin, MenuItem, PermissionType } from '@/types';

export function getAllAdminPermissions(roles?: IAdmin['roles']) {
  if (!roles) return [];

  // Handle both single role and array of roles
  const rolesArray = Array.isArray(roles) ? roles : [roles];

  return rolesArray.flatMap((role) => role?.permissions || []);
}

export function getFirstRouteFromUser(
  menuItems: MenuItem[],
  userPermissions: PermissionType[]
) {
  // 1. Check if user has 'Dashboard view' permission
  const hasDashboardView = userPermissions.includes('Dashboard view');

  if (hasDashboardView) {
    // Find and return the Dashboard route
    for (const section of menuItems) {
      for (const item of section.children) {
        if (item.permission?.toLowerCase() === 'dashboard view') {
          return item.path;
        }
      }
    }
  }

  // 2. If no Dashboard view, get the first "view" permission from the user
  const firstViewPermission = userPermissions.find((p) =>
    p.toLowerCase().endsWith('view')
  );

  if (!firstViewPermission) return null;

  // 3. Search the menu for the matching permission
  for (const section of menuItems) {
    for (const item of section.children) {
      if (item.permission === firstViewPermission) {
        return item.path;
      }
    }
  }

  return null;
}
