import {
  getVendorPayments,
  getVendorPaymentsSummary,
  getVendorPaymentById,
  getVendorPaymentPreferences,
  type VendorPaymentsQueryParams,
  type VendorPaymentsSummaryQueryParams,
} from '@/features/services';
import { useQuery } from '@tanstack/react-query';

export function vendorPaymentsManagementQueries() {
  function useGetVendorPayments(query?: VendorPaymentsQueryParams) {
    return useQuery({
      queryKey: ['vendor-payments', query],
      queryFn: () => getVendorPayments(query),
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

  function useGetVendorPaymentById(id: string) {
    return useQuery({
      queryKey: ['vendor-payment', id],
      queryFn: () => getVendorPaymentById(id),
      enabled: !!id,
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
    useGetVendorPaymentsSummary,
    useGetVendorPaymentById,
    useGetVendorPaymentPreferences,
  };
}
