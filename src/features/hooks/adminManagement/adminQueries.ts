import { getAllAdmins } from '@/features/services';
import { getAdminInfo } from '@/features/services';
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
      queryFn: () => getAdminInfo(Number(id)),
    });
  }
  return {
    useGetAdmins,
    useGetAdminDetails,
  };
}
