import React from 'react';

import { useAdminService } from '@/features/hooks/useAdminService';
import { useAuthStore } from '@/stores';
import type { PermissionType } from '@/types';
import { isTesting } from '@/utils/constants';
// import { getAllAdminPermissions } from '@/utils/helpers/role';

export function useContentGuard(
  permission?: PermissionType | PermissionType[]
) {
  const { user } = useAuthStore();
  const { useAdminProfile } = useAdminService();
  const { data, isLoading } = useAdminProfile();

  const userPermissions = React.useMemo(
    () => getAllAdminPermissions(data?.roles),
    [data?.roles]
  );

  if (isTesting) {
    return { isAllowed: true, isLoading: false };
  }

  // Wait for data to load before making authorization decisions
  if (isLoading) {
    return { isAllowed: false, isLoading: true };
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
