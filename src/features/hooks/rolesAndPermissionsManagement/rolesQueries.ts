import {
  getPermissionDetails,
  getPermissions,
  getRoleDetails,
  getRoles,
} from '@/features/services';
import { useQuery } from '@tanstack/react-query';

export function rolesAndPermissionsManagementQueries() {
  function useGetRoles() {
    return useQuery({
      queryKey: ['roles'],
      queryFn: getRoles,
    });
  }

  function useGetPermissions() {
    return useQuery({
      queryKey: ['permissions'],
      queryFn: getPermissions,
    });
  }

  function useGetRoleDetails(id: string) {
    return useQuery({
      queryKey: ['role-details', id],
      queryFn: () => getRoleDetails(id),
    });
  }

  function useGetPermissionDetails(id: string) {
    return useQuery({
      queryKey: ['permission-details', id],
      queryFn: () => getPermissionDetails(id),
    });
  }

  return {
    useGetRoles,
    useGetPermissions,
    useGetRoleDetails,
    useGetPermissionDetails,
  };
}
