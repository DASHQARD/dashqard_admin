import { getAllAdmins } from '@/features/services';
import { getAdminInfo } from '@/features/services/admins';
import { useQuery } from '@tanstack/react-query';

export function adminManagementQueries() {
  function useGetAdmins(queryParams?: Record<string, any>) {
    return useQuery({
      queryKey: ['admins', queryParams],
      queryFn: () => getAllAdmins(queryParams),
    });
  }

  function useGetAdminDetails(id: string) {
    return useQuery({
      queryKey: ['admin-details', id],
      queryFn: () => getAdminInfo(id),
      enabled: !!id,
    });
  }
  return {
    useGetAdmins,
    useGetAdminDetails,
  };
}
