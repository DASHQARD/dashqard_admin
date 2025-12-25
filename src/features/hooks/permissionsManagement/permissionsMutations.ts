import {
  createPermissions,
  updatePermissions,
  deletePermission,
} from '@/features/services';
import { useToast } from '@/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function permissionsManagementMutations() {
  function useCreatePermissions() {
    const queryClient = useQueryClient();

    const { error, success } = useToast();
    return useMutation({
      mutationFn: createPermissions,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['permissions'] });
        success('Permissions created successfully');
      },
      onError: (err: any) => {
        error(err?.message || 'Failed to create permissions');
      },
    });
  }

  function useUpdatePermissions() {
    const queryClient = useQueryClient();
    const { error, success } = useToast();
    return useMutation({
      mutationFn: updatePermissions,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['permissions'] });
        queryClient.invalidateQueries({ queryKey: ['permission'] });
        success('Permissions updated successfully');
      },
      onError: (err: any) => {
        error(err?.message || 'Failed to update permissions');
      },
    });
  }

  function useDeletePermission() {
    const queryClient = useQueryClient();
    const { error, success } = useToast();
    return useMutation({
      mutationFn: deletePermission,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['permissions'] });
        success('Permission deleted successfully');
      },
      onError: (err: any) => {
        error(err?.message || 'Failed to delete permission');
      },
    });
  }

  return {
    useCreatePermissions,
    useUpdatePermissions,
    useDeletePermission,
  };
}
