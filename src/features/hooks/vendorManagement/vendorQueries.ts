import { getVendorsList } from '@/features/services';
import { getVendorInfo } from '@/features/services';
import { useQuery } from '@tanstack/react-query';

export function vendorManagementQueries() {
  function useGetVendors() {
    return useQuery({
      queryKey: ['vendors'],
      queryFn: () => getVendorsList(),
    });
  }

  function useGetVendorDetails(id: string) {
    return useQuery({
      queryKey: ['vendor-details', id],
      queryFn: () => getVendorInfo(id),
    });
  }
  return {
    useGetVendors,
    useGetVendorDetails,
  };
}
