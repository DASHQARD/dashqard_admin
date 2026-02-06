import {
  createSuperAdminInvitation,
  deleteSuperAdminInvitation,
  updateSuperAdminInvitationStatus,
} from '@/features/services';
import { useToast } from '@/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function superAdminInvitationsManagementMutations() {
  function useCreateSuperAdminInvitation() {
    const queryClient = useQueryClient();
    const { error, success } = useToast();
    return useMutation({
      mutationFn: createSuperAdminInvitation,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['super-admin-invitations'],
        });
        success('Super admin invitation created successfully');
      },
      onError: (err: any) => {
        error(err?.message || 'Failed to create super admin invitation');
      },
    });
  }

  function useDeleteSuperAdminInvitation() {
    const queryClient = useQueryClient();
    const { error, success } = useToast();
    return useMutation({
      mutationFn: deleteSuperAdminInvitation,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['super-admin-invitations'],
        });
        success('Super admin invitation deleted successfully');
      },
      onError: (err: any) => {
        error(err?.message || 'Failed to delete super admin invitation');
      },
    });
  }

  function useUpdateSuperAdminInvitationStatus() {
    const queryClient = useQueryClient();
    const { error, success } = useToast();
    return useMutation({
      mutationFn: updateSuperAdminInvitationStatus,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['super-admin-invitations'],
        });
        success('Super admin invitation status updated successfully');
      },
      onError: (err: any) => {
        error(err?.message || 'Failed to update super admin invitation status');
      },
    });
  }

  return {
    useCreateSuperAdminInvitation,
    useDeleteSuperAdminInvitation,
    useUpdateSuperAdminInvitationStatus,
  };
}
