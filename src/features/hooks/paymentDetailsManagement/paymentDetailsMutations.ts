import { deletePaymentDetail } from '@/features/services';
import { useToast } from '@/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function paymentDetailsManagementMutations() {
  function useDeletePaymentDetail() {
    const queryClient = useQueryClient();
    const { error, success } = useToast();
    return useMutation({
      mutationFn: deletePaymentDetail,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['payment-details'] });
        success('Payment detail deleted successfully');
      },
      onError: (err: any) => {
        error(err?.message || 'Failed to delete payment detail');
      },
    });
  }

  return {
    useDeletePaymentDetail,
  };
}
