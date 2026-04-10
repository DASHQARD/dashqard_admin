import {
  getAllPermissions,
  getSinglePermission,
  getPermissionRole,
  type PermissionsQueryParams,
} from '@/features/services';
import { useQuery } from '@tanstack/react-query';

export function permissionsManagementQueries() {
  function useGetAllPermissions(query?: PermissionsQueryParams) {
    return useQuery({
      queryKey: ['permissions', query],
      queryFn: () => getAllPermissions(query),
    });
  }

  function useGetSinglePermission(permissionId: string) {
    return useQuery({
      queryKey: ['permission', permissionId],
      queryFn: () => getSinglePermission(permissionId),
      enabled: !!permissionId,
    });
  }

  function useGetPermissionRole(permissionId: string) {
    return useQuery({
      queryKey: ['permission-role', permissionId],
      queryFn: () => getPermissionRole(permissionId),
      enabled: !!permissionId,
    });
  }

  return {
    useGetAllPermissions,
    useGetSinglePermission,
    useGetPermissionRole,
  };
}
