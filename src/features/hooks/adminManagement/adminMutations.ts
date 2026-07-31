import {
  deleteAdmin,
  resendInviteAdmin,
  toggleAdminStatus,
} from '@/features/services';
import { useToast } from '@/hooks';
import type { UpdateAdminStatusPayload } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function invalidateAdminLists(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ['admins'] });
  queryClient.invalidateQueries({ queryKey: ['admin-list'] });
  queryClient.invalidateQueries({ queryKey: ['admin-details'] });
  queryClient.invalidateQueries({ queryKey: ['single-admin'] });
}

export function adminManagementMutations() {
  function useUpdateAdminStatus() {
    const queryClient = useQueryClient();
    const { error, success } = useToast();

    return useMutation({
      mutationFn: (data: UpdateAdminStatusPayload) => toggleAdminStatus(data),
      onSuccess: (response: any) => {
        invalidateAdminLists(queryClient);
        success(response?.message || 'Admin status updated successfully');
      },
      onError: (err: any) => {
        error(err?.message || 'Failed to update admin status');
      },
    });
  }

  function useResendAdminInvitation() {
    const queryClient = useQueryClient();
    const { error, success, info } = useToast();

    return useMutation({
      mutationFn: (id: string) => resendInviteAdmin(id),
      onSuccess: (response: any) => {
        invalidateAdminLists(queryClient);
        success(response?.message || 'Admin invitation resent successfully');
      },
      onError: (err: any) => {
        // Rate limit is informational — existing invite is still valid
        if (err?.status === 429) {
          info(
            err?.message ||
              'An invitation was recently sent to this email. Please try again later.'
          );
          return;
        }
        error(err?.message || 'Failed to resend invitation');
      },
    });
  }

  function useDeleteAdmin() {
    const queryClient = useQueryClient();
    const { error, success } = useToast();

    return useMutation({
      mutationFn: (id: string) => deleteAdmin(id),
      onSuccess: (response: any) => {
        invalidateAdminLists(queryClient);
        success(response?.message || 'Admin deleted successfully');
      },
      onError: (err: any) => {
        // Double-delete / already gone — treat as success for UI
        if (err?.status === 404) {
          invalidateAdminLists(queryClient);
          success('Admin deleted successfully');
          return;
        }
        error(err?.message || 'Failed to delete admin');
      },
    });
  }

  return {
    useUpdateAdminStatus,
    useResendAdminInvitation,
    useDeleteAdmin,
  };
}
