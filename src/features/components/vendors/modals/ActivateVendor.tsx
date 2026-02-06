import React, { useEffect, useRef, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  CustomIcon,
  Modal,
  Text,
  RadioGroup,
  RadioGroupItem,
  Loader,
} from '@/components';
import { usePersistedModalState } from '@/hooks';
import { useCustomForm } from '@/libs/react-hook-form';
import { MODALS } from '@/utils';
import { Controller } from 'react-hook-form';
import { z } from 'zod';
import { vendorManagementMutations } from '@/features/hooks/vendorManagement/vendorMutations';
import {
  vendorPaymentsManagementQueries,
  vendorPaymentsManagementMutations,
} from '@/features/hooks/vendorPaymentsManagement';

const PaymentPreferencesSchema = z.object({
  payment_frequency: z.enum(['daily', 'weekly', 'monthly']),
});

type PaymentPreferencesFormData = z.infer<typeof PaymentPreferencesSchema>;

type ActivateVendorModalData = {
  vendor_account_id?: number;
  vendor_id?: number | string;
  id?: number | string;
  vendor_name?: string;
};

export function ActivateVendor() {
  const modal = usePersistedModalState<ActivateVendorModalData>({
    paramName: MODALS.VENDOR_MANAGEMENT.CHILDREN.ACTIVATE,
  });

  const [step, setStep] = useState<'preferences' | 'confirm'>('preferences');

  const vendorData = modal.modalData;
  const isOpen = modal.isModalOpen(MODALS.VENDOR_MANAGEMENT.CHILDREN.ACTIVATE);

  const vendorAccountId = Number(
    vendorData?.vendor_account_id ??
      vendorData?.id ??
      vendorData?.vendor_id ??
      0
  );
  const vendorId = vendorData?.vendor_id ?? vendorData?.id ?? vendorAccountId;
  const vendorIdStr = vendorId ? String(vendorId) : '';

  const { useGetVendorPaymentPreferences } = vendorPaymentsManagementQueries();
  const {
    data: preferencesData,
    isLoading: isLoadingPreferences,
    error: preferencesError,
    isError,
  } = useGetVendorPaymentPreferences(
    vendorIdStr,
    isOpen && step === 'preferences'
  );

  const { useUpdateVendorPaymentPreferences } =
    vendorPaymentsManagementMutations();
  const updatePreferencesMutation = useUpdateVendorPaymentPreferences();
  const { useApproveVendor } = vendorManagementMutations();
  const approveMutation = useApproveVendor();

  const isNotFoundError =
    isError &&
    preferencesError &&
    ((preferencesError as any)?.status === 404 ||
      (preferencesError as any)?.response?.status === 404);
  const preferencesNotFound = preferencesData === null || isNotFoundError;

  const currentPreferences = React.useMemo(() => {
    if (preferencesData) {
      const data = preferencesData?.data || preferencesData;
      if (data && typeof data === 'object') {
        return {
          payment_frequency:
            (data.payment_frequency as PaymentPreferencesFormData['payment_frequency']) ||
            'monthly',
        };
      }
    }
    return { payment_frequency: 'monthly' as const };
  }, [preferencesData]);

  const formInstance = useCustomForm<PaymentPreferencesFormData>({
    resolver: zodResolver(PaymentPreferencesSchema),
    defaultValues: { payment_frequency: 'monthly' },
  });

  const prevVendorIdRef = useRef<string | undefined>(undefined);
  const prevFrequencyRef = useRef<string | undefined>(undefined);
  const didAutoAdvanceRef = useRef(false);

  // If preferences are already set, skip to confirm step
  useEffect(() => {
    if (
      isOpen &&
      !isLoadingPreferences &&
      vendorIdStr &&
      !preferencesNotFound &&
      step === 'preferences' &&
      !didAutoAdvanceRef.current
    ) {
      didAutoAdvanceRef.current = true;
      setStep('confirm');
    }
  }, [isOpen, isLoadingPreferences, vendorIdStr, preferencesNotFound, step]);

  useEffect(() => {
    if (isOpen && vendorIdStr && step === 'preferences') {
      const freq = currentPreferences.payment_frequency;
      if (
        vendorIdStr !== prevVendorIdRef.current ||
        freq !== prevFrequencyRef.current
      ) {
        prevVendorIdRef.current = vendorIdStr;
        prevFrequencyRef.current = freq;
        formInstance.reset({ payment_frequency: freq });
      }
    } else if (!isOpen) {
      prevVendorIdRef.current = undefined;
      prevFrequencyRef.current = undefined;
      didAutoAdvanceRef.current = false;
      setStep('preferences');
    }
  }, [
    isOpen,
    vendorIdStr,
    step,
    currentPreferences.payment_frequency,
    formInstance,
  ]);

  const onSavePreferences: SubmitHandler<PaymentPreferencesFormData> = (
    data
  ) => {
    if (!vendorIdStr) return;
    updatePreferencesMutation.mutate(
      {
        vendorId: vendorIdStr,
        data: { payment_frequency: data.payment_frequency },
      },
      {
        onSuccess: () => {
          setStep('confirm');
        },
      }
    );
  };

  const onApprove = () => {
    approveMutation.mutate(
      {
        vendor_account_id: vendorAccountId,
        approval_status: 'approved',
      },
      {
        onSuccess: () => {
          modal.closeModal();
          setStep('preferences');
        },
      }
    );
  };

  const handleClose = () => {
    modal.closeModal();
    setStep('preferences');
    formInstance.reset();
  };

  const isPreferencesError = isError && !isNotFoundError;

  return (
    <Modal
      panelClass="!w-[480px]"
      isOpen={isOpen}
      setIsOpen={(open) => {
        if (!open) handleClose();
      }}
      position="center"
    >
      <div className="p-6">
        {step === 'preferences' ? (
          <>
            <div className="flex flex-col gap-4 mb-6">
              <Text variant="h3" className="text-center font-semibold">
                Set payment preferences
              </Text>
              <p className="text-[#5F6166] text-center text-sm">
                Set payment frequency before approving this vendor.
              </p>
            </div>

            {vendorData?.vendor_name && (
              <div className="flex flex-col gap-1 pb-3 border-b border-gray-100 mb-4">
                <p className="text-gray-400 text-xs">Vendor</p>
                <Text variant="span" weight="normal" className="text-gray-800">
                  {vendorData.vendor_name}
                </Text>
              </div>
            )}

            {isLoadingPreferences ? (
              <div className="flex justify-center items-center py-8">
                <Loader />
              </div>
            ) : isPreferencesError ? (
              <div className="py-4">
                <Text variant="span" className="text-error text-sm">
                  Failed to load preferences. You can still set frequency and
                  continue.
                </Text>
              </div>
            ) : null}

            {!isLoadingPreferences && (
              <form
                onSubmit={formInstance.handleSubmit(onSavePreferences)}
                className="flex flex-col gap-4"
              >
                {preferencesNotFound && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Text variant="span" className="text-sm text-blue-700">
                      No preferences set yet. Choose a payment frequency below.
                    </Text>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <Text
                    variant="h6"
                    weight="semibold"
                    className="text-gray-900"
                  >
                    Payment frequency
                  </Text>
                  <Controller
                    control={formInstance.control}
                    name="payment_frequency"
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onValueChange={(value) =>
                          field.onChange(
                            value as PaymentPreferencesFormData['payment_frequency']
                          )
                        }
                        className="flex flex-col gap-2"
                      >
                        {[
                          { value: 'daily', label: 'Daily' },
                          { value: 'weekly', label: 'Weekly' },
                          { value: 'monthly', label: 'Monthly' },
                        ].map(({ value, label }) => (
                          <div key={value} className="flex items-center gap-3">
                            <RadioGroupItem value={value} id={value} />
                            <label
                              htmlFor={value}
                              className="flex-1 cursor-pointer text-gray-900 text-sm"
                            >
                              {label}
                            </label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                  />
                  {formInstance.formState.errors.payment_frequency?.message && (
                    <Text variant="span" className="text-sm text-error">
                      {formInstance.formState.errors.payment_frequency.message}
                    </Text>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="grow"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="secondary"
                    loading={updatePreferencesMutation.isPending}
                    className="grow"
                  >
                    Save & continue
                  </Button>
                </div>
              </form>
            )}
          </>
        ) : (
          <>
            <div className="space-y-4 flex flex-col items-center justify-center">
              <CustomIcon
                name="CheckMarkCircle"
                width={48}
                height={48}
                className="text-success"
              />
              <div>
                <Text
                  variant="h3"
                  className="text-center font-semibold capitalize"
                >
                  Approve vendor
                </Text>
                <p className="mt-4 mx-2 mb-8 text-[#5F6166] text-center text-sm">
                  Payment preferences are set. Are you sure you want to approve
                  this vendor?
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  didAutoAdvanceRef.current = true;
                  setStep('preferences');
                }}
                className="grow"
              >
                Back
              </Button>
              <Button
                variant="secondary"
                loading={approveMutation.isPending}
                className="grow"
                onClick={onApprove}
              >
                Approve
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
