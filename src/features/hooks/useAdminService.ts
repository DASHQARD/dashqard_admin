import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { usePersistedModalState, useToast } from '@/hooks';
import { axiosClient } from '@/libs';
import { useAuthStore } from '@/stores';
import type { Func } from '@/types/shared';
import type { Admin } from '@/types/admin';
import { MODALS } from '@/utils/constants';

import {
  assignAdminsToRole,
  assignRolesToAdmin,
  deleteAdmin,
  editAdmin,
  getAdminProfile,
  getAllAdmins,
  getAllArchivedAdmins,
  inviteAdmin,
  inviteBulkAdmin,
  permanentlyDeleteAdmin,
  reassignRoleAdmins,
  removeRoleFromAdmin,
  resendInviteAdmin,
  restoreAdmin,
  toggleAdminStatus,
} from '../services/admins';
import { getAdminInfo } from '../services/auth';

type AdminResponse = {
  admins: Admin[];
  currentPage: string;
  totalCount: number;
  totalPages: number;
};

export function useGetAllAdmins(query?: Record<string, any>) {
  return useQuery<AdminResponse, Error, AdminResponse>({
    queryKey: ['admin-list', query],
    queryFn: () => getAllAdmins(query),
  });
}
export function useGetAllAchievedAdmins(query?: Record<string, any>) {
  return useQuery<AdminResponse, Error, AdminResponse>({
    queryKey: ['admin-archived-list', query],
    queryFn: () => getAllArchivedAdmins(query),
  });
}
export function useGetSingleAdmin(id?: string) {
  return useQuery<Admin>({
    queryKey: ['single-admin', id],
    queryFn: async () => {
      const res = await axiosClient.get(`/admin/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useAdminService() {
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const { error, success } = useToast();
  const modal = usePersistedModalState({
    paramName: MODALS.ADMIN.ROOT,
  });

  function useAdminProfile() {
    return useQuery({
      queryKey: ['admin-profile', { type: 'logged_in' }],
      queryFn: getAdminProfile,
      enabled: isAuthenticated,
    });
  }

  function useInviteAdmin(options?: {
    onSuccess?: (response: any) => void;
    onError?: (err: any) => void;
  }) {
    const queryClient = useQueryClient();

    return useMutation({
      mutationKey: ['invite-admin'],
      mutationFn: inviteAdmin,
      onSuccess: (response: any) => {
        queryClient.invalidateQueries({
          queryKey: ['admin-list'],
        });

        success(response.message || 'Admin invited successfully');
        options?.onSuccess?.(response);
      },
      onError: (err: any) => {
        error(err?.message || 'Failed to invite admin');
        options?.onError?.(err);
      },
    });
  }
  function useInviteBulkAdmin(options?: {
    onSuccess?: (response: any) => void;
    onError?: (err: any) => void;
  }) {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: inviteBulkAdmin,
      onSuccess: (response: any) => {
        queryClient.invalidateQueries({
          queryKey: ['admin-list'],
        });

        success(response.message || 'Admin invited successfully');
        options?.onSuccess?.(response);
      },
      onError: (err: any) => {
        error(err?.message || 'Failed to invite admin');
        options?.onError?.(err);
      },
    });
  }
  function useEditAdmin() {
    return useMutation({
      mutationFn: editAdmin,
      onSuccess: (response: any) => {
        queryClient.invalidateQueries({
          queryKey: ['admin-list'],
        });
        success(response.message);
        modal.closeModal();
      },
      onError: (err) => {
        error(err.message);
      },
    });
  }

  function useResendInvitation() {
    return useMutation({
      mutationFn: resendInviteAdmin,
      onSuccess: (response: any) => {
        queryClient.invalidateQueries({
          queryKey: ['admin-list'],
        });
        success(response.message);
        modal.closeModal();
      },
      onError: (err) => {
        error(err.message);
      },
    });
  }
  function useAssignRolesToAdmin(options?: {
    onSuccess?: (response: any) => void;
    onError?: (err: any) => void;
  }) {
    return useMutation({
      mutationFn: assignRolesToAdmin,
      onSuccess: (response: any) => {
        queryClient.invalidateQueries({
          queryKey: ['admin-list'],
        });
        queryClient.invalidateQueries({
          queryKey: ['single-admin'],
        });
        success(response.message);
        options?.onSuccess?.(response);
      },
      onError: (err) => {
        error(err.message);
      },
    });
  }
  function useAssignAdminsToRole(options?: {
    onSuccess?: (response: any) => void;
    onError?: (err: any) => void;
  }) {
    return useMutation({
      mutationFn: assignAdminsToRole,
      onSuccess: (response: any) => {
        queryClient.invalidateQueries({
          queryKey: ['admin-list'],
        });
        success(response.message);
        options?.onSuccess?.(response);
      },
      onError: (err) => {
        error(err.message);
      },
    });
  }
  function useReassignRoleAdmins(options?: {
    onSuccess?: (response: any) => void;
    onError?: (err: any) => void;
  }) {
    return useMutation({
      mutationFn: reassignRoleAdmins,
      onSuccess: (response: any) => {
        queryClient.invalidateQueries({
          queryKey: ['admin-list'],
        });
        queryClient.invalidateQueries({
          queryKey: ['role-list'],
        });
        success(response.message);
        options?.onSuccess?.(response);
      },
      onError: (err) => {
        error(err.message);
      },
    });
  }

  function useDeleteAdmin(runOnSuccess?: Func) {
    return useMutation({
      mutationFn: deleteAdmin,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['admin-list'],
        });
        queryClient.invalidateQueries({
          queryKey: ['admin-archived-list'],
        });
        success('Admin archived successfully');
        runOnSuccess?.();
      },
      onError: (err) => {
        error(err.message);
      },
    });
  }
  function usePermanentlyDeleteAdmin(runOnSuccess?: Func) {
    return useMutation({
      mutationFn: permanentlyDeleteAdmin,
      onSuccess: (response: any) => {
        queryClient.invalidateQueries({
          queryKey: ['admin-archived-list'],
        });
        queryClient.invalidateQueries({
          queryKey: ['admin-list'],
        });
        success(response.message);
        runOnSuccess?.();
      },
      onError: (err) => {
        error(err.message);
      },
    });
  }
  function useRestoreAdmin(runOnSuccess?: Func) {
    return useMutation({
      mutationFn: restoreAdmin,
      onSuccess: (response: any) => {
        queryClient.invalidateQueries({
          queryKey: ['admin-list'],
        });
        queryClient.invalidateQueries({
          queryKey: ['admin-archived-list'],
        });
        success(response.message);
        runOnSuccess?.();
      },
      onError: (err) => {
        error(err.message);
      },
    });
  }
  function useRemoveRoleFromAdmin(runOnSuccess?: Func) {
    return useMutation({
      mutationFn: removeRoleFromAdmin,
      onSuccess: (response: any) => {
        queryClient.invalidateQueries({
          queryKey: ['admin-list'],
        });
        queryClient.invalidateQueries({
          queryKey: ['single-admin'],
        });
        success(response.message);
        runOnSuccess?.();
      },
      onError: (err) => {
        error(err.message);
      },
    });
  }
  function useToggleAdminStatus(runOnSuccess?: Func) {
    return useMutation({
      mutationFn: toggleAdminStatus,
      onSuccess: (response: any) => {
        queryClient.invalidateQueries({
          queryKey: ['admin-list'],
        });
        queryClient.invalidateQueries({
          queryKey: ['single-admin'],
        });
        success(response?.message);
        runOnSuccess?.();
      },
      onError: (err) => {
        error(err.message);
      },
    });
  }

  function useGetAdminInfo(id: number | undefined) {
    return useQuery({
      queryKey: ['admin-info', id],
      queryFn: () => getAdminInfo(id!),
      enabled: !!id && typeof id === 'number',
    });
  }

  return {
    useAssignAdminsToRole,
    useAdminProfile,
    useInviteAdmin,
    useGetAdminInfo,
    useDeleteAdmin,
    useToggleAdminStatus,
    useAssignRolesToAdmin,
    useEditAdmin,
    useRemoveRoleFromAdmin,
    useReassignRoleAdmins,
    useResendInvitation,
    useInviteBulkAdmin,
    useRestoreAdmin,
    usePermanentlyDeleteAdmin,
  };
}
