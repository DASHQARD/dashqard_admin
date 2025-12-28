import { updateServiceFees } from '@/features/services';
import { useToast } from '@/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function feesManagementMutations() {
  function useUpdateServiceFees() {
    const queryClient = useQueryClient();
    const { error, success } = useToast();
    return useMutation({
      mutationFn: updateServiceFees,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['service-fees'] });
        success('Service fees updated successfully');
      },
      onError: (err: any) => {
        error(err?.message || 'Failed to update service fees');
      },
    });
  }

  return {
    useUpdateServiceFees,
  };
}
