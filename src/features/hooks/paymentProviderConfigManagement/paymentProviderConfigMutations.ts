import { updatePaymentProviderConfig } from '@/features/services';
import { useToast } from '@/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function paymentProviderConfigManagementMutations() {
  function useUpdatePaymentProviderConfig() {
    const queryClient = useQueryClient();
    const { error, success } = useToast();

    return useMutation({
      mutationFn: updatePaymentProviderConfig,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['payment-provider-config'],
        });
        success('Payment provider configuration updated successfully');
      },
      onError: (err: any) => {
        error(
          err?.message || 'Failed to update payment provider configuration'
        );
      },
    });
  }

  return {
    useUpdatePaymentProviderConfig,
  };
}
