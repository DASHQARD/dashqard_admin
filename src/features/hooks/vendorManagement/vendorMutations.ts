import { approveVendor, updateVendorAccountStatus } from '@/features/services';
import { useToast } from '@/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function vendorManagementMutations() {
  function useApproveVendor() {
    const queryClient = useQueryClient();
    const { error, success } = useToast();
    return useMutation({
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

  function useUpdateVendorStatus() {
    const queryClient = useQueryClient();
    const { error, success } = useToast();
    return useMutation({
      mutationFn: updateVendorAccountStatus,
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['vendors'] });
        queryClient.invalidateQueries({ queryKey: ['vendor-details'] });
        success(
          `Vendor ${variables.status === 'active' ? 'activated' : 'deactivated'} successfully`
        );
      },
      onError: (err: any) => {
        error(err?.message || 'Failed to update vendor status');
      },
    });
  }

  return {
    useApproveVendor,
    useUpdateVendorStatus,
  };
}
