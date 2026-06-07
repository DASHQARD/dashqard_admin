import {
  getAllRoles,
  getSingleRole,
  getAllRolesPermissions,
  getRolesCount,
  getRolePermissions,
} from '@/features/services';
import { useQuery } from '@tanstack/react-query';

export function rolesManagementQueries() {
  function useGetAllRoles(query?: Record<string, unknown>) {
    return useQuery({
      queryKey: ['roles', query],
      queryFn: () => getAllRoles(query),
    });
  }

  function useGetRolesForSelect() {
    return useQuery({
      queryKey: ['roles', 'select', { limit: 100 }],
      queryFn: () => getAllRoles({ limit: 100 }),
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
    useGetRolesForSelect,
    useGetSingleRole,
    useGetAllRolesPermissions,
    useGetRolesCount,
    useGetRolePermissions,
  };
}
