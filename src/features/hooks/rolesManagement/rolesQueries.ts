import {
  getAllRoles,
  getSingleRole,
  getAllRolesPermissions,
  getRolesCount,
  getRolePermissions,
} from '@/features/services';
import { useQuery } from '@tanstack/react-query';

export function rolesManagementQueries() {
  function useGetAllRoles() {
    return useQuery({
      queryKey: ['roles'],
      queryFn: getAllRoles,
    });
  }

  function useGetSingleRole(roleId: string) {
    return useQuery({
      queryKey: ['role', roleId],
      queryFn: () => getSingleRole(roleId),
      enabled: !!roleId,
    });
  }

  function useGetAllRolesPermissions() {
    return useQuery({
      queryKey: ['roles-permissions'],
      queryFn: getAllRolesPermissions,
    });
  }

  function useGetRolesCount() {
    return useQuery({
      queryKey: ['roles-count'],
      queryFn: getRolesCount,
    });
  }

  function useGetRolePermissions(roleId: string) {
    return useQuery({
      queryKey: ['role-permissions', roleId],
      queryFn: () => getRolePermissions(roleId),
      enabled: !!roleId,
    });
  }

  return {
    useGetAllRoles,
    useGetSingleRole,
    useGetAllRolesPermissions,
    useGetRolesCount,
    useGetRolePermissions,
  };
}
