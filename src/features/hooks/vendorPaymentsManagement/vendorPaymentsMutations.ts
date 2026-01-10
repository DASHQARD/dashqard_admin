import {
  updateVendorPayment,
  deleteVendorPayment,
  updateVendorPaymentPreferences,
  type UpdateVendorPaymentData,
  type UpdateVendorPaymentPreferencesData,
} from '@/features/services';
import { useToast } from '@/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function vendorPaymentsManagementMutations() {
  function useUpdateVendorPayment() {
    const queryClient = useQueryClient();
    const { error, success } = useToast();
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: UpdateVendorPaymentData }) =>
        updateVendorPayment(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['vendor-payments'] });
        queryClient.invalidateQueries({ queryKey: ['vendor-payment'] });
        queryClient.invalidateQueries({ queryKey: ['vendor-payments-summary'] });
        success('Vendor payment updated successfully');
      },
      onError: (err: any) => {
        error(err?.message || 'Failed to update vendor payment');
      },
    });
  }

  function useDeleteVendorPayment() {
    const queryClient = useQueryClient();
    const { error, success } = useToast();
    return useMutation({
      mutationFn: deleteVendorPayment,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['vendor-payments'] });
        queryClient.invalidateQueries({ queryKey: ['vendor-payment'] });
        queryClient.invalidateQueries({ queryKey: ['vendor-payments-summary'] });
        success('Vendor payment deleted successfully');
      },
      onError: (err: any) => {
        error(err?.message || 'Failed to delete vendor payment');
      },
    });
  }

  function useUpdateVendorPaymentPreferences() {
    const queryClient = useQueryClient();
    const { error, success } = useToast();
    return useMutation({
      mutationFn: ({
        vendorId,
        data,
      }: {
        vendorId: string | number;
        data: UpdateVendorPaymentPreferencesData;
      }) => updateVendorPaymentPreferences(vendorId, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['vendor-payment-preferences'] });
        queryClient.invalidateQueries({ queryKey: ['vendor-details'] });
        queryClient.invalidateQueries({ queryKey: ['vendors'] });
        success('Vendor payment preferences updated successfully');
      },
      onError: (err: any) => {
        error(err?.message || 'Failed to update vendor payment preferences');
      },
    });
  }

  return {
    useUpdateVendorPayment,
    useDeleteVendorPayment,
    useUpdateVendorPaymentPreferences,
  };
}

