import { updateCorporateStatus } from '@/features/services';
import { useToast } from '@/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function corporateManagementMutations() {
  function useUpdateCorporateStatus() {
    const queryClient = useQueryClient();
    const { error, success } = useToast();
    return useMutation({
      mutationFn: updateCorporateStatus,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['corporates'] });
        success('Corporate status updated successfully');
      },
      onError: (err: any) => {
        error(err?.message || 'Failed to update corporate status');
      },
    });
  }

  return {
    useUpdateCorporateStatus,
  };
}
