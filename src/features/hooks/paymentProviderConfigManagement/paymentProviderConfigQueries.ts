import { getPaymentProviderConfig } from '@/features/services';
import { useQuery } from '@tanstack/react-query';

export function paymentProviderConfigManagementQueries() {
  function useGetPaymentProviderConfig(options?: { enabled?: boolean }) {
    return useQuery({
      queryKey: ['payment-provider-config'],
      queryFn: getPaymentProviderConfig,
      enabled: options?.enabled ?? true,
    });
  }

  return {
    useGetPaymentProviderConfig,
  };
}
