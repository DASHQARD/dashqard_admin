import React from 'react';

import { useAuthStore } from '@/stores';
import type { PermissionType } from '@/types/roles';
import { isTesting } from '@/utils/constants';
import {
  getAllAdminPermissions,
  isSuperAdminAccount,
} from '@/utils/helpers/role';

export function useContentGuard(
  permission?: PermissionType | PermissionType[]
) {
  const {
    user,
    permissions: storedPermissions,
    role: authRole,
  } = useAuthStore();

  const userPermissions = React.useMemo(() => {
    // Prefer permissions from login response (auth store)
    if (storedPermissions && Array.isArray(storedPermissions)) {
      return getAllAdminPermissions(undefined, storedPermissions);
    }

    if (authRole) {
      return getAllAdminPermissions(authRole);
    }

    // JWT decoded user may include role/permissions
    if (user?.role) {
      return getAllAdminPermissions(user.role);
    }

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

    if (user?.permissions && Array.isArray(user.permissions)) {
      return getAllAdminPermissions(undefined, user.permissions);
    }

    return [];
  }, [user, storedPermissions, authRole]);

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

  const isAllowed = hasPermission || isSuperAdminAccount(user, authRole);

  return { isAllowed, isLoading: false, userPermissions };
}
