import {
  approveVendor,
  updateVendorAccountStatus,
  removeVendorAdmin,
} from '@/features/services';
import { useToast } from '@/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function vendorManagementMutations() {
  function useApproveVendor() {
    const queryClient = useQueryClient();
    const { error, success } = useToast();
    return useMutation<
      any,
      any,
      {
        vendor_account_id: string | number;
        approval_status: 'approved' | 'rejected';
        rejection_reason?: string;
      }
    >({
      mutationFn: approveVendor,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['vendors'] });
        queryClient.invalidateQueries({ queryKey: ['vendor-details'] });
        success('Vendor approved successfully');
      },
      onError: (err: any) => {
        error(err?.message || 'Failed to approve vendor');
      },
    });
  }

  function useRejectVendor() {
    const queryClient = useQueryClient();
    const { error, success } = useToast();
    return useMutation({
      mutationFn: (data: {
        vendor_account_id: string | number;
        rejection_reason?: string;
      }) =>
        approveVendor({
          vendor_account_id: data.vendor_account_id,
          approval_status: 'rejected',
          ...(data.rejection_reason && {
            rejection_reason: data.rejection_reason,
          }),
        }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['vendors'] });
        queryClient.invalidateQueries({ queryKey: ['vendor-details'] });
        success('Vendor rejected successfully');
      },
      onError: (err: any) => {
        error(err?.message || 'Failed to reject vendor');
      },
    });
  }

  function useUpdateVendorStatus() {
    const queryClient = useQueryClient();
    const { error, success } = useToast();
    return useMutation({
      mutationFn: updateVendorAccountStatus,
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['vendors'] });
        queryClient.invalidateQueries({ queryKey: ['vendor-details'] });
        success(
          `Vendor ${variables.approval_status === 'approved' ? 'approved' : 'rejected'} successfully`
        );
      },
      onError: (err: any) => {
        error(err?.message || 'Failed to update vendor status');
      },
    });
  }

  function useRemoveVendorAdmin() {
    const queryClient = useQueryClient();
    const { error, success } = useToast();
    return useMutation({
      mutationFn: removeVendorAdmin,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['vendors'] });
        queryClient.invalidateQueries({ queryKey: ['vendor-details'] });
        success('Vendor admin removed successfully');
      },
      onError: (err: any) => {
        error(err?.message || 'Failed to remove vendor admin');
      },
    });
  }

  return {
    useApproveVendor,
    useRejectVendor,
    useUpdateVendorStatus,
    useRemoveVendorAdmin,
  };
}
