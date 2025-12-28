import { updateTransactionLimits } from '@/features/services';
import { useToast } from '@/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function transactionLimitsManagementMutations() {
  function useUpdateTransactionLimits() {
    const queryClient = useQueryClient();
    const { error, success } = useToast();
    return useMutation({
      mutationFn: updateTransactionLimits,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['transaction-limits'] });
        success('Transaction limits updated successfully');
      },
      onError: (err: any) => {
        error(err?.message || 'Failed to update transaction limits');
      },
    });
  }

  return {
    useUpdateTransactionLimits,
  };
}

