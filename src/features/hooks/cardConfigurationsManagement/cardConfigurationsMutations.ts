import { updateCardConfigurations } from '@/features/services';
import { useToast } from '@/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function cardConfigurationsManagementMutations() {
  function useUpdateCardConfigurations() {
    const queryClient = useQueryClient();
    const { error, success } = useToast();

    return useMutation({
      mutationFn: updateCardConfigurations,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['card-configurations'] });
        success('Card configuration updated successfully');
      },
      onError: (err: any) => {
        error(err?.message || 'Failed to update card configuration');
      },
    });
  }

  return {
    useUpdateCardConfigurations,
  };
}
