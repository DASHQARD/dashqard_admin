import {
  getVendorPayments,
  getVendorPaymentsSummary,
  getVendorPaymentById,
  getVendorPaymentPreferences,
  getVendorPaymentBranches,
  type VendorPaymentsQueryParams,
  type VendorPaymentsSummaryQueryParams,
  type VendorPaymentBranchesQueryParams,
  getBanks,
} from '@/features/services';
import { useQuery } from '@tanstack/react-query';

export function vendorPaymentsManagementQueries() {
  function useGetVendorPayments(query?: VendorPaymentsQueryParams) {
    return useQuery({
      queryKey: ['vendor-payments', query],
      queryFn: () => getVendorPayments(query),
    });
  }

  function useGetBanks() {
    return useQuery({
      queryKey: ['banks'],
      queryFn: () => getBanks(),
    });
  }

  function useGetVendorPaymentsSummary(
    query?: VendorPaymentsSummaryQueryParams
  ) {
    return useQuery({
      queryKey: ['vendor-payments-summary', query],
      queryFn: () => getVendorPaymentsSummary(query),
    });
  }

  function useGetVendorPaymentById(
    id: string,
    options?: { enabled?: boolean }
  ) {
    const enabledById = Boolean(id);
    return useQuery({
      queryKey: ['vendor-payment', id],
      queryFn: () => getVendorPaymentById(id),
      enabled: enabledById && (options?.enabled ?? true),
    });
  }

  function useGetVendorPaymentBranches(
    query?: VendorPaymentBranchesQueryParams,
    options?: { enabled?: boolean }
  ) {
    return useQuery({
      queryKey: ['vendor-payments-branches', query],
      queryFn: () => getVendorPaymentBranches(query),
      enabled: options?.enabled ?? true,
    });
  }

  function useGetVendorPaymentPreferences(
    vendorId: string | number,
    enabled: boolean = true
  ) {
    return useQuery({
      queryKey: ['vendor-payment-preferences', vendorId],
      queryFn: () => getVendorPaymentPreferences(vendorId),
      enabled: !!vendorId && enabled,
      retry: (failureCount, error: any) => {
        // Don't retry on 404 errors (preferences not found)
        if (error?.status === 404) {
          return false;
        }
        return failureCount < 3;
      },
    });
  }

  return {
    useGetVendorPayments,
    useGetBanks,
    useGetVendorPaymentsSummary,
    useGetVendorPaymentById,
    useGetVendorPaymentBranches,
    useGetVendorPaymentPreferences,
  };
}
