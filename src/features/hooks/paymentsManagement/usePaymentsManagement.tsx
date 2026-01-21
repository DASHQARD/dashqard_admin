import { useReducerSpread } from '@/hooks';
import { DEFAULT_QUERY } from '@/utils';
import { paymentsManagementQueries } from './paymentsQueries';
import React, { useCallback, useMemo } from 'react';

export function usePaymentsManagementBase() {
  const [query, setQuery] = useReducerSpread(DEFAULT_QUERY);

  const { useGetPaymentsList } = paymentsManagementQueries();

  const paramsForApi = useMemo(() => {
    const apiParams: any = {
      limit: query.limit || 10,
    }
    const queryWithAfter = query as any;
    if (queryWithAfter.after) {
      // Send after as date string (API expects date string format)
      apiParams.after = queryWithAfter.after;
    }
    if (query.search) {
      apiParams.search = query.search
    }
    if (query.status) {
      apiParams.status = query.status
    }
    return apiParams
  }, [query])

  const { data: paymentsResponse, isLoading: isLoadingPayments } = useGetPaymentsList(paramsForApi);

  // Extract data from response
  const paymentsList = React.useMemo(() => {
    if (!paymentsResponse) return null;
    // Response is the full object with data array and pagination info
    if (Array.isArray(paymentsResponse)) {
      return paymentsResponse;
    }
    return paymentsResponse.data || [];
  }, [paymentsResponse]);

  const pagination = React.useMemo(() => {
    if (!paymentsResponse || Array.isArray(paymentsResponse)) {
      return {
        hasNextPage: false,
        hasPreviousPage: false,
        next: null,
        previous: null,
      };
    }
    return {
      hasNextPage: paymentsResponse.pagination?.hasNextPage ?? false,
      hasPreviousPage: paymentsResponse.pagination?.hasPreviousPage ?? false,
      next: paymentsResponse.pagination?.next ?? null,
      previous: paymentsResponse.pagination?.previous ?? null,
    };
  }, [paymentsResponse]);

  const handleNextPage = useCallback(() => {
    if (pagination?.hasNextPage && pagination?.next) {
      // Set after as date string (API expects date string format)
      setQuery({ ...query, after: pagination.next } as any)
    }
  }, [pagination, query, setQuery])

  const handleSetAfter = useCallback(
    (after: string) => {
      // Set after as date string or empty string to reset
      setQuery({ ...query, after: after || undefined } as any)
    },
    [query, setQuery],
  )

  // Calculate estimated total for display
  const estimatedTotal = useMemo(() => {
    const paymentsArray = Array.isArray(paymentsList) ? paymentsList : [];
    return pagination?.hasNextPage
      ? paymentsArray.length + (query.limit || 10)
      : paymentsArray.length
  }, [pagination, paymentsList, query.limit])

  return {
    query,
    setQuery,
    paymentsList: Array.isArray(paymentsList) ? paymentsList : [],
    isLoadingPayments,
    pagination,
    handleNextPage,
    handleSetAfter,
    estimatedTotal,
  };
}

