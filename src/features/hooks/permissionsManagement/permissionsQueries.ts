import {
  getAllPermissions,
  getSinglePermission,
  getPermissionRole,
} from '@/features/services';
import { useQuery } from '@tanstack/react-query';

export function permissionsManagementQueries() {
  function useGetAllPermissions() {
    return useQuery({
      queryKey: ['permissions'],
      queryFn: getAllPermissions,
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
