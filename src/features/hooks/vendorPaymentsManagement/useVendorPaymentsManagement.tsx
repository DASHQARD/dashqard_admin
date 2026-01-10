import { useReducerSpread } from '@/hooks';
import { DEFAULT_QUERY } from '@/utils';
import { vendorPaymentsManagementQueries } from './vendorPaymentsQueries';
import React from 'react';

export function useVendorPaymentsManagementBase() {
  const [query, setQuery] = useReducerSpread(DEFAULT_QUERY);

  const { useGetVendorPayments, useGetVendorPaymentsSummary } =
    vendorPaymentsManagementQueries();

  const { data, isLoading: isLoadingVendorPayments } = useGetVendorPayments();

  const { data: summaryData, isLoading: isLoadingSummary } =
    useGetVendorPaymentsSummary();

  const vendorPaymentsList = React.useMemo(() => {
    if (!data) return [];
    // Response structure: { data: [...], pagination: {...} }
    return Array.isArray(data) ? data : Array.isArray(data) ? data : [];
  }, [data]);

  const totalCount = React.useMemo(() => {
    // For cursor-based pagination, we might not have total count
    // Use the length of current data + pagination info if available
    if (data?.pagination?.total !== undefined) {
      return data.pagination.total;
    }
    return vendorPaymentsList.length;
  }, [vendorPaymentsList, data?.pagination]);

  // Use server-side summary data if available, otherwise fallback to empty values
  const summary = React.useMemo(() => {
    if (summaryData) {
      // API response structure: { data: { pending_count, paid_count, overdue_count, total_pending, total_paid, total_overdue, grand_total } }
      const data = summaryData;

      return {
        totalPending: Number(data.total_pending) || 0,
        totalPaid: Number(data.total_paid) || 0,
        totalOverdue: Number(data.total_overdue) || 0,
        grandTotal: Number(data.grand_total) || 0,
        pendingCount: Number(data.pending_count) || 0,
        paidCount: Number(data.paid_count) || 0,
        overdueCount: Number(data.overdue_count) || 0,
      };
    }

    // Fallback to empty values while loading
    return {
      totalPending: 0,
      totalPaid: 0,
      totalOverdue: 0,
      grandTotal: 0,
      pendingCount: 0,
      paidCount: 0,
      overdueCount: 0,
    };
  }, [summaryData]);

  return {
    query,
    setQuery,
    vendorPaymentsList,
    isLoadingVendorPayments,
    isLoadingSummary,
    totalCount,
    pagination: data?.pagination,
    summary,
  };
}
