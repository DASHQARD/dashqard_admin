import { useReducerSpread } from '@/hooks';
import { DEFAULT_QUERY } from '@/utils';
import { paymentsManagementQueries } from './paymentsQueries';
import React from 'react';

export function usePaymentsManagementBase() {
  const [query, setQuery] = useReducerSpread(DEFAULT_QUERY);

  const { useGetPaymentsList } = paymentsManagementQueries();
  const { data: paymentsList, isLoading: isLoadingPayments } = useGetPaymentsList();

  // Filter payments based on search query (client-side filtering)
  const filteredPaymentsList = React.useMemo(() => {
    if (!query.search) return paymentsList || [];
    if (!paymentsList || !Array.isArray(paymentsList)) return [];

    const searchLower = query.search.toLowerCase();
    return paymentsList.filter((payment: any) => {
      // Search across common payment fields
      return (
        payment.trans_id?.toLowerCase().includes(searchLower) ||
        payment.receipt_number?.toLowerCase().includes(searchLower) ||
        payment.user_name?.toLowerCase().includes(searchLower) ||
        payment.phone?.toLowerCase().includes(searchLower) ||
        payment.status?.toLowerCase().includes(searchLower) ||
        payment.type?.toLowerCase().includes(searchLower) ||
        payment.amount?.toString().includes(searchLower) ||
        payment.currency?.toLowerCase().includes(searchLower) ||
        payment.user_type?.toLowerCase().includes(searchLower) ||
        payment.id?.toString().includes(searchLower)
      );
    });
  }, [paymentsList, query.search]);

  return {
    query,
    setQuery,
    paymentsList: filteredPaymentsList,
    isLoadingPayments,
  };
}

