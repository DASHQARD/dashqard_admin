import React from 'react';
import {
  Modal,
  Text,
  PrintView,
  Button,
  RadioGroup,
  RadioGroupItem,
  Checkbox,
  Input,
} from '@/components';
import { usePersistedModalState, useToast } from '@/hooks';
import { MODALS } from '@/utils/constants';
import { Icon } from '@/libs';
import { useCustomForm } from '@/libs/react-hook-form';
import { Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';

const PaymentPreferencesSchema = z.object({
  payment_frequency: z.enum(['daily', 'weekly', 'monthly']),
  auto_payout: z.boolean(),
  minimum_payout_amount: z
    .number()
    .min(0, 'Minimum amount must be 0 or greater')
    .optional(),
});

type PaymentPreferencesFormData = z.infer<typeof PaymentPreferencesSchema>;

type VendorPaymentData = {
  id: string;
  vendor_id?: string;
  vendor_name?: string;
  payment_frequency?: string;
  branch_location?: string;
  amount?: number;
  payment_period?: string;
  status?: string;
  due_date?: string;
  paid_date?: string | null;
  invoice_number?: string;
  description?: string;
};

export function VendorPaymentPreferences() {
  const modal = usePersistedModalState<VendorPaymentData>({
    paramName: MODALS.VENDOR_PAYMENT_MANAGEMENT.PARAM_NAME,
  });
  const toast = useToast();

  const vendorPaymentData = modal.modalData;
  const isOpen = modal.isModalOpen(
    MODALS.VENDOR_PAYMENT_MANAGEMENT.CHILDREN.PREFERENCES
  );

  // Get current payment preferences from vendor payment data or defaults
  const currentPreferences = React.useMemo(() => {
    if (!vendorPaymentData) {
      return {
        payment_frequency: 'monthly' as const,
        auto_payout: true,
        minimum_payout_amount: 0,
      };
    }

    // Map payment frequency from display format to form format
    const mapFrequency = (freq?: string): 'daily' | 'weekly' | 'monthly' => {
      if (!freq) return 'monthly';
      const lower = freq.toLowerCase();
      if (lower.includes('daily') || lower === 'daily') return 'daily';
      if (lower.includes('weekly') || lower === 'weekly') return 'weekly';
      return 'monthly';
    };

    return {
      payment_frequency: mapFrequency(vendorPaymentData.payment_frequency),
      auto_payout: true, // Default, would come from vendor profile in real app
      minimum_payout_amount: 0, // Default, would come from vendor profile in real app
    };
  }, [vendorPaymentData]);

  // Mutation for updating vendor payment preferences
  const { mutateAsync: updatePreferences, isPending } = useMutation({
    mutationFn: async (data: {
      vendor_id: string;
      payment_frequency: string;
      auto_payout: boolean;
      minimum_payout_amount?: number;
    }) => {
      // Simulate API call - in real app, this would be:
      // await axiosClient.patch(`/admin/vendors/${data.vendor_id}/payment-preferences`, {
      //   payment_frequency: data.payment_frequency,
      //   auto_payout: data.auto_payout,
      //   minimum_payout_amount: data.minimum_payout_amount,
      // })
      console.log('Updating vendor payment preferences:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        success: true,
        message: 'Vendor payment preferences updated successfully',
      };
    },
    onSuccess: () => {
      toast.success('Vendor payment preferences updated successfully');
      modal.closeModal();
      // In a real app, you would invalidate the vendor payments query here:
      // queryClient.invalidateQueries(['vendor-payments']);
    },
    onError: (error: any) => {
      toast.error(
        error?.message || 'Failed to update vendor payment preferences'
      );
    },
  });

  // Form for payment preferences
  const form = useCustomForm<PaymentPreferencesFormData>({
    resolver: zodResolver(PaymentPreferencesSchema),
    defaultValues: currentPreferences,
  });

  // Track previous vendor ID to avoid unnecessary resets
  const previousVendorIdRef = React.useRef<string | undefined>(undefined);

  // Update form when modal opens or vendor payment data changes (only when vendor ID changes)
  React.useEffect(() => {
    if (isOpen && vendorPaymentData?.vendor_id) {
      if (vendorPaymentData.vendor_id !== previousVendorIdRef.current) {
        previousVendorIdRef.current = vendorPaymentData.vendor_id;
        form.reset(currentPreferences, { keepDefaultValues: false });
      }
    } else if (!isOpen) {
      // Reset the ref when modal closes
      previousVendorIdRef.current = undefined;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, vendorPaymentData?.vendor_id]);

  const onSubmit = async (data: PaymentPreferencesFormData) => {
    if (!vendorPaymentData?.vendor_id) {
      toast.error('Vendor ID is required');
      return;
    }

    await updatePreferences({
      vendor_id: vendorPaymentData.vendor_id,
      payment_frequency: data.payment_frequency,
      auto_payout: data.auto_payout,
      minimum_payout_amount: data.minimum_payout_amount,
    });
  };

  return (
    <Modal
      title="Update Vendor Payment Preferences"
      position="side"
      isOpen={isOpen}
      setIsOpen={(isOpen) => {
        if (!isOpen) {
          modal.closeModal();
        }
      }}
      panelClass="!w-[864px]"
      showClose={true}
    >
      {!vendorPaymentData ? (
        <div className="h-full px-6 py-8 flex flex-col gap-6 justify-center items-center">
          <Text variant="span">No vendor payment data found</Text>
        </div>
      ) : (
        <PrintView>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="h-full px-6 flex flex-col"
          >
            <div className="grow">
              {/* Vendor Information */}
              <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <Text
                  variant="h6"
                  weight="semibold"
                  className="text-gray-900 mb-3 flex items-center gap-2"
                >
                  <Icon icon="bi:shop" className="text-primary-600" />
                  Vendor Information
                </Text>
                <div className="space-y-2">
                  <div>
                    <Text variant="span" className="text-xs text-gray-500">
                      Vendor Name
                    </Text>
                    <Text
                      variant="span"
                      weight="medium"
                      className="text-gray-900 block"
                    >
                      {vendorPaymentData.vendor_name || 'N/A'}
                    </Text>
                  </div>
                  <div>
                    <Text variant="span" className="text-xs text-gray-500">
                      Vendor ID
                    </Text>
                    <Text
                      variant="span"
                      weight="medium"
                      className="text-gray-900 block"
                    >
                      {vendorPaymentData.vendor_id || 'N/A'}
                    </Text>
                  </div>
                  <div>
                    <Text variant="span" className="text-xs text-gray-500">
                      Current Payment Frequency
                    </Text>
                    <Text
                      variant="span"
                      weight="medium"
                      className="text-gray-900 block"
                    >
                      {vendorPaymentData.payment_frequency || 'N/A'}
                    </Text>
                  </div>
                </div>
              </div>

              {/* Payment Frequency Section */}
              <div className="mb-6">
                <Text
                  variant="h6"
                  weight="semibold"
                  className="text-gray-900 mb-4 flex items-center gap-2"
                >
                  <Icon icon="bi:calendar-check" className="text-primary-600" />
                  Payment Schedule
                </Text>
                <Controller
                  control={form.control}
                  name="payment_frequency"
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-primary-300 cursor-pointer transition-all">
                          <RadioGroupItem value="daily" id="daily" />
                          <label
                            htmlFor="daily"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="font-semibold text-gray-900">
                              Daily
                            </div>
                            <div className="text-sm text-gray-600">
                              Vendor receives payments every day
                            </div>
                          </label>
                        </div>
                        <div className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-primary-300 cursor-pointer transition-all">
                          <RadioGroupItem value="weekly" id="weekly" />
                          <label
                            htmlFor="weekly"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="font-semibold text-gray-900">
                              Weekly
                            </div>
                            <div className="text-sm text-gray-600">
                              Vendor receives payments every week
                            </div>
                          </label>
                        </div>
                        <div className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-primary-300 cursor-pointer transition-all">
                          <RadioGroupItem value="monthly" id="monthly" />
                          <label
                            htmlFor="monthly"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="font-semibold text-gray-900">
                              Monthly
                            </div>
                            <div className="text-sm text-gray-600">
                              Vendor receives payments once per month
                            </div>
                          </label>
                        </div>
                      </div>
                    </RadioGroup>
                  )}
                />
              </div>

              {/* Auto Payout Section */}
              <div className="mb-6">
                <Text
                  variant="h6"
                  weight="semibold"
                  className="text-gray-900 mb-4 flex items-center gap-2"
                >
                  <Icon icon="bi:arrow-repeat" className="text-primary-600" />
                  Auto Payout Settings
                </Text>
                <Controller
                  control={form.control}
                  name="auto_payout"
                  render={({ field }) => (
                    <div className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg">
                      <Checkbox
                        checked={field.value}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          field.onChange(e.target.checked)
                        }
                        id="auto_payout"
                      />
                      <label
                        htmlFor="auto_payout"
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-semibold text-gray-900">
                          Enable Auto Payout
                        </div>
                        <div className="text-sm text-gray-600">
                          Automatically process payments when due
                        </div>
                      </label>
                    </div>
                  )}
                />
              </div>

              {/* Minimum Payout Amount Section */}
              <div className="mb-6">
                <Text
                  variant="h6"
                  weight="semibold"
                  className="text-gray-900 mb-4 flex items-center gap-2"
                >
                  <Icon
                    icon="bi:currency-dollar"
                    className="text-primary-600"
                  />
                  Minimum Payout Amount
                </Text>
                <Controller
                  control={form.control}
                  name="minimum_payout_amount"
                  render={({ field }) => (
                    <div>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={field.value?.toString() || '0'}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          field.onChange(
                            e.target.value ? parseFloat(e.target.value) : 0
                          )
                        }
                        placeholder="Enter minimum payout amount"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Minimum amount required before processing a payout
                      </p>
                    </div>
                  )}
                />
              </div>

              {/* Info Message */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Icon
                    icon="bi:info-circle"
                    className="text-blue-600 text-lg shrink-0 mt-0.5"
                  />
                  <div>
                    <Text
                      variant="span"
                      weight="medium"
                      className="text-blue-900 block mb-1"
                    >
                      Payment Preferences Information
                    </Text>
                    <Text
                      variant="span"
                      className="text-blue-700 text-sm block"
                    >
                      These preferences will apply to all future payments for
                      this vendor. Changes will take effect for the next payment
                      cycle.
                    </Text>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={modal.closeModal}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="secondary"
                loading={isPending}
                disabled={isPending}
              >
                Save Preferences
              </Button>
            </div>
          </form>
        </PrintView>
      )}
    </Modal>
  );
}
