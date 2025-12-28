import { getPaymentsDailyStats } from '@/features/services';
import { useQuery } from '@tanstack/react-query';

export function paymentDetailsManagementQueries() {
  function useGetPaymentDetails() {
    return useQuery({
      queryKey: ['payment-details'],
      queryFn: () => getPaymentsDailyStats(),
    });
  }

  return {
    useGetPaymentDetails,
  };
}
