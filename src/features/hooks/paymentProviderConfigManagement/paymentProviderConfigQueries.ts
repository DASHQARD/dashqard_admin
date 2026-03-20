import { getPaymentProviderConfig } from '@/features/services';
import { useQuery } from '@tanstack/react-query';

export function paymentProviderConfigManagementQueries() {
  function useGetPaymentProviderConfig() {
    return useQuery({
      queryKey: ['payment-provider-config'],
      queryFn: getPaymentProviderConfig,
    });
  }

  return {
    useGetPaymentProviderConfig,
  };
}
