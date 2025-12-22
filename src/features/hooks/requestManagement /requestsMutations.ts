import { updateRequestStatus } from '@/features/services';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function requestManagementMutations() {
  function useUpdateRequestStatus(options?: {
    onSuccess?: (response: any) => void;
    onError?: (err: any) => void;
  }) {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: updateRequestStatus,
      onSuccess: (response: any) => {
        queryClient.invalidateQueries({ queryKey: ['request-corporates'] });
        options?.onSuccess?.(response);
      },
    });
  }
  return {
    useUpdateRequestStatus,
  };
}
