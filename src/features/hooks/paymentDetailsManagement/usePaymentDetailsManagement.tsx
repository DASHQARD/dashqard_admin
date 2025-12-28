import { useReducerSpread } from '@/hooks';
import { DEFAULT_QUERY } from '@/utils';
import { paymentDetailsManagementQueries } from './paymentDetailsQueries';
import React from 'react';

export function usePaymentDetailsManagementBase() {
  const [query, setQuery] = useReducerSpread(DEFAULT_QUERY);

  const { useGetPaymentDetails } = paymentDetailsManagementQueries();
  const { data: paymentDetailsList, isLoading: isLoadingPaymentDetails } = useGetPaymentDetails();

  // Filter payment details based on search query (client-side filtering)
  const filteredPaymentDetailsList = React.useMemo(() => {
    if (!query.search) return paymentDetailsList || [];
    if (!paymentDetailsList || !Array.isArray(paymentDetailsList)) return [];

    const searchLower = query.search.toLowerCase();
    return paymentDetailsList.filter((item: any) => {
      return (
        item.date?.toLowerCase().includes(searchLower) ||
        item.total_count?.toString().toLowerCase().includes(searchLower) ||
        item.total_amount?.toString().toLowerCase().includes(searchLower) ||
        item.currency?.toLowerCase().includes(searchLower)
      );
    });
  }, [paymentDetailsList, query.search]);

  return {
    query,
    setQuery,
    paymentDetailsList: filteredPaymentDetailsList,
    isLoadingPaymentDetails,
  };
}

