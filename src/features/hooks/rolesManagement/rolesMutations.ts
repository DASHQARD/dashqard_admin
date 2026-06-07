import {
  createRole,
  updateRole,
  deleteRole,
  assignRole,
} from '@/features/services';
import { useToast } from '@/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function rolesManagementMutations() {
  type CreateRolePayload = {
    role: string;
    description: string;
    permissions: string[];
  };

  function useCreateRole() {
    const queryClient = useQueryClient();
    const { error, success } = useToast();
    return useMutation<any, any, CreateRolePayload>({
      mutationFn: (payload) => createRole(payload),
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['roles'] }),
          queryClient.invalidateQueries({ queryKey: ['roles-count'] }),
          queryClient.refetchQueries({ queryKey: ['roles'], type: 'active' }),
          queryClient.refetchQueries({
            queryKey: ['roles-count'],
            type: 'active',
          }),
        ]);
        success('Role created successfully');
      },
      onError: (err: any) => {
        error(err?.message || 'Failed to create role');
      },
    });
  }

  function useUpdateRole() {
    const queryClient = useQueryClient();
    const { error, success } = useToast();
    return useMutation({
      mutationFn: updateRole,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['roles'] });
        queryClient.invalidateQueries({ queryKey: ['role'] });
        queryClient.invalidateQueries({ queryKey: ['role-permissions'] });
        success('Role updated successfully');
      },
      onError: (err: any) => {
        error(err?.message || 'Failed to update role');
      },
    });
  }

  function useDeleteRole() {
    const queryClient = useQueryClient();
    const { error, success } = useToast();
    return useMutation({
      mutationFn: deleteRole,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['roles'] });
        queryClient.invalidateQueries({ queryKey: ['roles-count'] });
        success('Role deleted successfully');
      },
      onError: (err: any) => {
        error(err?.message || 'Failed to delete role');
      },
    });
  }

  function useAssignRole() {
    const queryClient = useQueryClient();
    const { error, success } = useToast();
    return useMutation({
      mutationFn: assignRole,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['roles'] });
        queryClient.invalidateQueries({ queryKey: ['admins'] });
        queryClient.invalidateQueries({ queryKey: ['admin-details'] });
        success(
          'Role assigned successfully. The affected admin must log in again for new permissions to apply.'
        );
      },
      onError: (err: { status?: number; message?: string }) => {
        if (err?.status === 401) {
          error(
            'You need the roles:assign permission to change an admin role. Ask a super admin to add roles:assign to your role, then log in again.'
          );
          return;
        }
        error(err?.message || 'Failed to assign role');
      },
    });
  }

  return {
    useCreateRole,
    useUpdateRole,
    useDeleteRole,
    useAssignRole,
  };
}
