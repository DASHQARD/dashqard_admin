import React from 'react';

import { useAuthStore } from '@/stores';
import type { PermissionType } from '@/types/roles';
import { isTesting } from '@/utils/constants';
import { getAllAdminPermissions } from '@/utils/helpers/role';

export function useContentGuard(
  permission?: PermissionType | PermissionType[]
) {
  const { user, permissions: storedPermissions } = useAuthStore();

  const userPermissions = React.useMemo(() => {
    // First, try to get permissions from admin profile (IAdmin structure)
    if (user?.role) {
      return getAllAdminPermissions(user.role);
    }

    // Handle nested permissions structure (from verify-login-token response format)
    // data.permissions.permissions is an array of permission objects
    if (
      user?.permissions &&
      typeof user.permissions === 'object' &&
      'permissions' in user.permissions
    ) {
      const permissionsArray = (
        user.permissions as { permissions?: Array<{ permission: string }> }
      ).permissions;
      if (Array.isArray(permissionsArray)) {
        return getAllAdminPermissions(undefined, permissionsArray);
      }
    }

    // If data has permissions array directly (flat structure)
    if (user?.permissions && Array.isArray(user.permissions)) {
      return getAllAdminPermissions(undefined, user.permissions);
    }

    // Fallback to stored permissions from auth store (from verify-login-token)
    if (storedPermissions && Array.isArray(storedPermissions)) {
      return getAllAdminPermissions(undefined, storedPermissions);
    }

    return [];
  }, [user, storedPermissions]);

  if (isTesting) {
    return { isAllowed: true, isLoading: false };
  }

  let hasPermission: boolean;
  if (Array.isArray(permission)) {
    // Check if user has ANY of the required permissions (case-insensitive)
    hasPermission = permission.some((perm) =>
      userPermissions.some(
        (userPerm) => userPerm.toLowerCase() === perm.toLowerCase()
      )
    );
  } else if (permission) {
    // Check if user has the required permission (case-insensitive)
    hasPermission = userPermissions.some(
      (userPerm) => userPerm.toLowerCase() === permission.toLowerCase()
    );
  } else {
    hasPermission = true;
  }

  const isAllowed = hasPermission || user?.isSuperAdmin;

  return { isAllowed, isLoading: false, userPermissions };
}
