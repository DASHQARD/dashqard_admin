import { deletePayment, updatePaymentStatus } from '@/features/services';
import { useToast } from '@/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function paymentsManagementMutations() {
  function useDeletePayment() {
    const queryClient = useQueryClient();
    const { error, success } = useToast();
    return useMutation({
      mutationFn: deletePayment,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['payments'] });
        queryClient.invalidateQueries({ queryKey: ['payment'] });
        queryClient.invalidateQueries({ queryKey: ['payments-user'] });
        queryClient.invalidateQueries({ queryKey: ['payments-with-user-details'] });
        success('Payment deleted successfully');
      },
      onError: (err: any) => {
        error(err?.message || 'Failed to delete payment');
      },
    });
  }

  function useUpdatePaymentStatus() {
    const queryClient = useQueryClient();
    const { error, success } = useToast();
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: { status: string } }) =>
        updatePaymentStatus(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['payments'] });
        queryClient.invalidateQueries({ queryKey: ['payment'] });
        queryClient.invalidateQueries({ queryKey: ['payments-user'] });
        queryClient.invalidateQueries({ queryKey: ['payments-with-user-details'] });
        success('Payment status updated successfully');
      },
      onError: (err: any) => {
        error(err?.message || 'Failed to update payment status');
      },
    });
  }

  return {
    useDeletePayment,
    useUpdatePaymentStatus,
  };
}

