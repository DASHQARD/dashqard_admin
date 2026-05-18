import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inviteAdmin } from '../services';
import type { InviteAdminPayload, InviteAdminResponse } from '@/types/admin';
import { useToast } from '@/hooks';

type InviteAdminError = { status: number; message: string };

export function useInviteAdmin() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation<InviteAdminResponse, InviteAdminError, InviteAdminPayload>(
    {
      mutationFn: inviteAdmin,
      onSuccess: (response) => {
        queryClient.invalidateQueries({ queryKey: ['admins'] });
        toast.success(response.message || 'Admin invited successfully');
      },
      onError: (error) => {
        if (error?.status !== 429) {
          toast.error(error?.message || 'Failed to invite admin');
        }
      },
    }
  );
}
