import { getVendorsList, getVendorDetails, getVendorQrCode } from '@/features/services';
import { useQuery } from '@tanstack/react-query';

export function vendorManagementQueries() {
  function useGetVendors() {
    return useQuery({
      queryKey: ['vendors'],
      queryFn: () => getVendorsList(),
    });
  }

  function useGetVendorDetails(id: string | number) {
    return useQuery({
      queryKey: ['vendor-details', id],
      queryFn: () => getVendorDetails(id),
      enabled: !!id,
    });
  }

  function useGetVendorQrCode(id: string | number) {
    return useQuery({
      queryKey: ['vendor-qr-code', id],
      queryFn: () => getVendorQrCode(id),
      enabled: false, // Only fetch when explicitly called
    });
  }

  return {
    useGetVendors,
    useGetVendorDetails,
    useGetVendorQrCode,
  };
}
