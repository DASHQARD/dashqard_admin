import { getTransactionLimits } from '@/features/services';
import { useQuery } from '@tanstack/react-query';

export function transactionLimitsManagementQueries() {
  function useGetTransactionLimits() {
    return useQuery({
      queryKey: ['transaction-limits'],
      queryFn: getTransactionLimits,
    });
  }

  return {
    useGetTransactionLimits,
  };
}

