import { getAllAdmins } from '@/features/services';
import { getAdminInfo } from '@/features/services/admins';
import { useQuery } from '@tanstack/react-query';

export function adminManagementQueries() {
  function useGetAdmins() {
    return useQuery({
      queryKey: ['admins'],
      queryFn: () => getAllAdmins(),
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
