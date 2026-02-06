import { useMemo } from 'react';
import { vendorPaymentsManagementQueries } from './vendorPaymentsQueries';

export function useOverduePaymentsCount(): number {
  const { useGetVendorPaymentsSummary } = vendorPaymentsManagementQueries();
  const { data: summary } = useGetVendorPaymentsSummary();

  return useMemo(() => {
    const raw = summary?.data ?? summary;
    if (raw && typeof raw === 'object' && 'overdue_count' in raw) {
      const count = (raw as { overdue_count?: number }).overdue_count;
      return typeof count === 'number' && count >= 0 ? count : 0;
    }
    return 0;
  }, [summary]);
}
