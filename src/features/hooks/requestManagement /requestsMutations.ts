import { deleteRequest, updateRequestStatus } from '@/features/services';
import { useToast } from '@/hooks';
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
        console.log('response', response);
        queryClient.invalidateQueries({ queryKey: ['request-corporates'] });
        options?.onSuccess?.(response);
      },
    });
  }

  function useDeleteRequest() {
    const queryClient = useQueryClient();
    const { error, success } = useToast();
    return useMutation({
      mutationFn: deleteRequest,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['request-corporates'] });
        success('Request deleted successfully');
      },
      onError: (err: any) => {
        error(err?.message || 'Failed to delete request');
      },
    });
  }

  return {
    useUpdateRequestStatus,
    useDeleteRequest,
  };
}
