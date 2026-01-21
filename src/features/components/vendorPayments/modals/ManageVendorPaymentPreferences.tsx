import React, { useEffect, useRef } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Modal,
  Text,
  Button,
  RadioGroup,
  RadioGroupItem,
  Loader,
} from '@/components';
import { usePersistedModalState } from '@/hooks';
import { MODALS } from '@/utils/constants';
import { Icon } from '@/libs';
import { useCustomForm } from '@/libs/react-hook-form';
import { Controller } from 'react-hook-form';
import { z } from 'zod';
import {
  vendorPaymentsManagementQueries,
  vendorPaymentsManagementMutations,
} from '@/features/hooks/vendorPaymentsManagement';

const PaymentPreferencesSchema = z.object({
  payment_frequency: z.enum(['daily', 'weekly', 'bi-weekly', 'monthly']),
});

type PaymentPreferencesFormData = z.infer<typeof PaymentPreferencesSchema>;

type VendorData = {
  id?: number | string;
  vendor_id?: number | string;
  vendor_name?: string;
};

export function ManageVendorPaymentPreferences() {
  const modal = usePersistedModalState<VendorData>({
    paramName: MODALS.VENDOR_PAYMENT_MANAGEMENT.PARAM_NAME,
  });

  const vendorData = modal.modalData;
  const isOpen = modal.isModalOpen(
    MODALS.VENDOR_PAYMENT_MANAGEMENT.CHILDREN.MANAGE_PREFERENCES
  );

  const vendorId =
    vendorData?.vendor_id || vendorData?.id
      ? String(vendorData.vendor_id || vendorData.id)
      : '';

  const { useGetVendorPaymentPreferences } = vendorPaymentsManagementQueries();
  const {
    data: preferencesData,
    isLoading: isLoadingPreferences,
    error: preferencesError,
    isError,
  } = useGetVendorPaymentPreferences(vendorId, isOpen);

  const { useUpdateVendorPaymentPreferences } =
    vendorPaymentsManagementMutations();
  const updatePreferencesMutation = useUpdateVendorPaymentPreferences();

  // Check if preferences not found (404 handled by service returning null, or error status)
  const isNotFoundError =
    isError &&
    preferencesError &&
    ((preferencesError as any)?.status === 404 ||
      (preferencesError as any)?.response?.status === 404);
  // Preferences not found if data is null (service returned null for 404) or we have a 404 error
  const preferencesNotFound = preferencesData === null || isNotFoundError;

  const currentPreferences = React.useMemo(() => {
    // If we have data, use it
    if (preferencesData) {
      const data = preferencesData?.data || preferencesData;
      if (data && typeof data === 'object') {
        return {
          payment_frequency:
            (data.payment_frequency as
              | 'daily'
              | 'weekly'
              | 'monthly') || 'monthly',
        };
      }
    }
    // Default values when preferences not found (404) or not set
    return {
      payment_frequency: 'monthly' as const,
    };
  }, [preferencesData]);

  const form = useCustomForm<PaymentPreferencesFormData>({
    resolver: zodResolver(PaymentPreferencesSchema),
    defaultValues: {
      payment_frequency: 'monthly',
    },
  });

  const previousVendorIdRef = useRef<string | undefined>(undefined);
  const previousPaymentFrequencyRef = useRef<string | undefined>(undefined);

  // Update form when modal opens or vendor/preferences change (only when they actually change)
  useEffect(() => {
    if (isOpen && vendorId) {
      const currentFrequency = currentPreferences.payment_frequency;

      // Only reset if vendor ID changed or payment frequency changed
      if (
        vendorId !== previousVendorIdRef.current ||
        currentFrequency !== previousPaymentFrequencyRef.current
      ) {
        previousVendorIdRef.current = vendorId;
        previousPaymentFrequencyRef.current = currentFrequency;
        form.reset({
          payment_frequency: currentFrequency,
        });
      }
    } else if (!isOpen) {
      // Reset refs when modal closes
      previousVendorIdRef.current = undefined;
      previousPaymentFrequencyRef.current = undefined;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, vendorId, currentPreferences.payment_frequency]);

  const onSubmit: SubmitHandler<PaymentPreferencesFormData> = (data) => {
    if (!vendorId) return;

    updatePreferencesMutation.mutate(
      {
        vendorId,
        data: {
          payment_frequency: data.payment_frequency,
        },
      },
      {
        onSuccess: () => {
          modal.closeModal();
          form.reset();
        },
      }
    );
  };

  return (
    <Modal
      panelClass="!w-[680px]"
      title="Manage Vendor Payment Preferences"
      isOpen={isOpen}
      setIsOpen={(isOpen) => {
        if (!isOpen) {
          modal.closeModal();
          form.reset();
        }
      }}
      position="side"
      showClose={true}
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="h-full flex flex-col"
      >
        <div className="h-full px-6 flex flex-col gap-6 justify-between">
          {isLoadingPreferences ? (
            <div className="flex justify-center items-center py-12">
              <Loader />
            </div>
          ) : isError && !isNotFoundError ? (
            <div className="flex flex-col justify-center items-center py-12 gap-4">
              <Text variant="span" className="text-error">
                Failed to load payment preferences. Please try again.
              </Text>
              {preferencesError && (
                <Text variant="span" className="text-sm text-gray-500">
                  {(preferencesError as any)?.message || 'An error occurred'}
                </Text>
              )}
            </div>
          ) : (
            <>
              <div className="grow overflow-y-auto">
                <div className="flex flex-col gap-6">
                  {vendorData?.vendor_name && (
                    <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
                      <p className="text-gray-400 text-xs">Vendor Name</p>
                      <Text
                        variant="span"
                        weight="normal"
                        className="text-gray-800"
                      >
                        {vendorData.vendor_name}
                      </Text>
                    </div>
                  )}

                  {preferencesNotFound && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <Text variant="span" className="text-sm text-blue-700">
                        Payment preferences not found. You can set them below.
                      </Text>
                    </div>
                  )}

                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <Icon
                        icon="bi:calendar-check"
                        className="text-primary-600"
                      />
                      <Text
                        variant="h6"
                        weight="semibold"
                        className="text-gray-900"
                      >
                        Payment Frequency
                      </Text>
                    </div>

                    <Controller
                      control={form.control}
                      name="payment_frequency"
                      render={({ field }) => (
                        <div className="space-y-3">
                          <RadioGroup
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(
                                value as
                                | 'daily'
                                | 'weekly'
                                | 'monthly'
                              );
                            }}
                            className="flex flex-col gap-3"
                          >
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value="daily" id="daily" />
                              <label
                                htmlFor="daily"
                                className="flex-1 cursor-pointer text-gray-900"
                              >
                                Daily
                              </label>
                            </div>
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value="weekly" id="weekly" />
                              <label
                                htmlFor="weekly"
                                className="flex-1 cursor-pointer text-gray-900"
                              >
                                Weekly
                              </label>
                            </div>
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value="monthly" id="monthly" />
                              <label
                                htmlFor="monthly"
                                className="flex-1 cursor-pointer text-gray-900"
                              >
                                Monthly
                              </label>
                            </div>
                          </RadioGroup>
                          {form.formState.errors.payment_frequency?.message && (
                            <Text variant="span" className="text-sm text-error">
                              {form.formState.errors.payment_frequency.message}
                            </Text>
                          )}
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-end pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    modal.closeModal();
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="secondary"
                  disabled={updatePreferencesMutation.isPending}
                >
                  {updatePreferencesMutation.isPending
                    ? 'Saving...'
                    : preferencesNotFound
                      ? 'Save Preferences'
                      : 'Update Preferences'}
                </Button>
              </div>
            </>
          )}
        </div>
      </form>
    </Modal>
  );
}
