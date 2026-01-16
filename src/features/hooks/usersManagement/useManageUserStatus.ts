import { useMutation, useQueryClient } from '@tanstack/react-query';
import { manageUserAccountStatus } from '../../services/users';
import type { ManageUserAccountStatusPayload } from '@/types/user';

export function useManageUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ManageUserAccountStatusPayload) =>
      manageUserAccountStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
