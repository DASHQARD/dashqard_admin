import {
  updateVendorPayment,
  deleteVendorPayment,
  updateVendorPaymentPreferences,
  createVendorPayment,
  type UpdateVendorPaymentData,
  type UpdateVendorPaymentPreferencesData,
  type CreateVendorPaymentPayload,
  processVendorPayment,
} from '@/features/services';
import { useToast } from '@/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function vendorPaymentsManagementMutations() {
  function useUpdateVendorPayment() {
    const queryClient = useQueryClient();
    const { error, success } = useToast();
    return useMutation({
      mutationFn: ({
        id,
        data,
      }: {
        id: string;
        data: UpdateVendorPaymentData;
      }) => updateVendorPayment(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['vendor-payments'] });
        queryClient.invalidateQueries({ queryKey: ['vendor-payment'] });
        queryClient.invalidateQueries({
          queryKey: ['vendor-payments-summary'],
        });
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
        queryClient.invalidateQueries({
          queryKey: ['vendor-payments-summary'],
        });
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
        queryClient.invalidateQueries({
          queryKey: ['vendor-payment-preferences'],
        });
        queryClient.invalidateQueries({ queryKey: ['vendor-details'] });
        queryClient.invalidateQueries({ queryKey: ['vendors'] });
        success('Vendor payment preferences updated successfully');
      },
      onError: (err: any) => {
        error(err?.message || 'Failed to update vendor payment preferences');
      },
    });
  }

  function useCreateVendorPayment() {
    const queryClient = useQueryClient();
    const { error, success } = useToast();
    return useMutation({
      mutationFn: (data: CreateVendorPaymentPayload) =>
        createVendorPayment(data),
      onSuccess: (response: any) => {
        queryClient.invalidateQueries({ queryKey: ['vendor-payments'] });
        queryClient.invalidateQueries({
          queryKey: ['vendor-payments-summary'],
        });
        queryClient.invalidateQueries({
          queryKey: ['vendor-payments-branches'],
        });
        success(response?.message || 'Vendor payment created successfully');
      },
      onError: (err: any) => {
        error(err?.message || 'Failed to create vendor payment');
      },
    });
  }

  function useProcessVendorPayment() {
    const queryClient = useQueryClient();
    const { error, success } = useToast();
    return useMutation({
      mutationFn: processVendorPayment,
      onSuccess: (response: any) => {
        queryClient.invalidateQueries({ queryKey: ['vendor-payments'] });
        queryClient.invalidateQueries({ queryKey: ['vendor-payment'] });
        queryClient.invalidateQueries({
          queryKey: ['vendor-payments-summary'],
        });
        success(response.message || 'Vendor payment processed successfully');
      },
      onError: (err: any) => {
        error(err?.message || 'Failed to process vendor payment');
      },
    });
  }

  return {
    useUpdateVendorPayment,
    useDeleteVendorPayment,
    useUpdateVendorPaymentPreferences,
    useCreateVendorPayment,
    useProcessVendorPayment,
  };
}
