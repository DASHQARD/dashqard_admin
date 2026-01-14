import React from 'react';
import { Button, Modal, Text, Input, Combobox } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { MODALS } from '@/utils/constants';
import { useToast } from '@/hooks/useToast';
import {
  vendorPaymentsManagementMutations,
  vendorPaymentsManagementQueries,
} from '@/features/hooks/vendorPaymentsManagement';
import { Controller, type SubmitHandler } from 'react-hook-form';
import { Icon, useCustomForm } from '@/libs';
import { formatCurrency, formatDate } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PaymentFormSchema } from '@/utils/schemas/payment';

type VendorPaymentData = {
  branch_id: number;
  branch_location: string;
  created_at: string;
  description: string;
  due_date: string;
  id: number;
  invoice_number: string;
  notes: string | null;
  paid_date: string | null;
  payment_amount: string | number;
  payment_frequency: string;
  payment_method: string | null;
  payment_period: string;
  status: string;
  updated_at: string;
  vendor_gvid: string;
  vendor_id: number;
  vendor_name: string;
  vendor_user_id: number;
};

export function ProcessVendorPayment() {
  const modal = usePersistedModalState<VendorPaymentData>({
    paramName: MODALS.VENDOR_PAYMENT_MANAGEMENT.PARAM_NAME,
  });

  const isOpen = modal.isModalOpen(
    MODALS.VENDOR_PAYMENT_MANAGEMENT.CHILDREN.CREATE
  );

  const { useProcessVendorPayment } = vendorPaymentsManagementMutations();
  const { mutateAsync: processVendorPaymentMutation, isPending: isProcessing } =
    useProcessVendorPayment();

  const { useGetBanks } = vendorPaymentsManagementQueries();
  const { data: banksData } = useGetBanks();

  const banks = React.useMemo(() => {
    if (!banksData) return [];
    return banksData.map((bank: any) => ({
      label: bank.name, // Display name
      value: bank.code, // Use code as value
      name: bank.name, // Store name separately
    }));
  }, [banksData]);

  const toast = useToast();

  const form = useCustomForm({
    resolver: zodResolver(PaymentFormSchema),
    defaultValues: {
      payment_method: 'bank',
      bank_code: '',
      account_number: '',
      payment_date: new Date().toISOString().split('T')[0],
      notes: '',
    },
  });

  const paymentData = modal.modalData;

  // Get selected bank name for display
  const selectedBankCode = form.watch('bank_code');
  const selectedBankName = React.useMemo(() => {
    if (!selectedBankCode || !banks.length) return '';
    const bank = banks.find((b: any) => b.value === selectedBankCode);
    return bank ? bank.name : '';
  }, [selectedBankCode, banks]);

  // Reset form when modal opens/closes or paymentData changes
  React.useEffect(() => {
    if (isOpen && paymentData) {
      const today = new Date().toISOString().split('T')[0];
      const formData: any = {
        payment_method: paymentData.payment_method || 'bank',
        bank_code: '',
        account_number: '',
        payment_date: today,
        notes: paymentData.notes || '',
      };

      form.reset(formData);
    }
  }, [isOpen, paymentData?.id]);

  const onSubmit: SubmitHandler<z.infer<typeof PaymentFormSchema>> = (data) => {
    if (!paymentData) return;

    let payload:
      | {
          id: number;
          payment_method: 'bank';
          bank_code: string;
          account_number: string;
          payment_date: string;
          notes: string;
        }
      | {
          id: number;
          payment_method: 'mobile_money';
          mobile_money_number: string;
          mobile_money_provider: string;
          payment_date: string;
          notes: string;
        };

    if (data.payment_method === 'bank') {
      payload = {
        id: Number(paymentData.id),
        payment_method: 'bank',
        bank_code: data.bank_code,
        account_number: data.account_number,
        payment_date: data.payment_date,
        notes: data.notes || '',
      };
    } else {
      payload = {
        id: Number(paymentData.id),
        payment_method: 'mobile_money',
        mobile_money_number: data.mobile_money_number,
        mobile_money_provider: data.mobile_money_provider,
        payment_date: data.payment_date,
        notes: data.notes || '',
      };
    }

    console.log('Submitting payload:', payload);

    processVendorPaymentMutation(payload as any, {
      onSuccess: () => {
        modal.closeModal();
        form.reset();
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to process payment');
      },
    });
  };

  const handleClose = React.useCallback(() => {
    modal.closeModal();
    setTimeout(() => form.reset(), 0);
  }, [modal, form]);

  if (!paymentData) return null;

  return (
    <Modal
      panelClass="!w-[700px] min-w-full max-h-[90vh]"
      title="Process Vendor Payout"
      isOpen={isOpen}
      setIsOpen={(isOpen) => {
        if (!isOpen) {
          handleClose();
        }
      }}
      position="center"
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="px-6 py-4 max-h-[80vh] overflow-y-auto"
      >
        <div className="space-y-6">
          {/* Payment Summary Section */}
          <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-100">
            <div className="flex items-center gap-2 mb-4">
              <Icon icon="bi:info-circle" className="text-blue-600 text-xl" />
              <Text variant="h6" weight="semibold" className="text-blue-900">
                Payment Summary
              </Text>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Vendor</p>
                <Text
                  variant="span"
                  weight="semibold"
                  className="text-gray-800"
                >
                  {paymentData?.vendor_name || '-'}
                </Text>
                <p className="text-xs text-gray-500 mt-1">
                  ID: {paymentData?.vendor_id || '-'}
                </p>
                {paymentData?.branch_location && (
                  <p className="text-xs text-gray-500 mt-1">
                    Location: {paymentData?.branch_location}
                  </p>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Invoice Number</p>
                <Text
                  variant="span"
                  weight="semibold"
                  className="text-gray-800"
                >
                  {paymentData?.invoice_number || '-'}
                </Text>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Payment Frequency</p>
                <Text variant="span" weight="normal" className="text-gray-800">
                  {paymentData?.payment_frequency || '-'}
                </Text>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Payment Period</p>
                <Text variant="span" weight="normal" className="text-gray-800">
                  {paymentData?.payment_period || '-'}
                </Text>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Due Date</p>
                <Text variant="span" weight="normal" className="text-gray-800">
                  {paymentData?.due_date
                    ? formatDate(paymentData.due_date)
                    : '-'}
                </Text>
              </div>
              <div className="col-span-2 pt-2 border-t border-blue-200">
                <p className="text-xs text-gray-600 mb-1">Amount to Pay</p>
                <Text variant="h4" weight="bold" className="text-blue-700">
                  {paymentData?.payment_amount
                    ? formatCurrency(
                        typeof paymentData?.payment_amount === 'string'
                          ? parseFloat(paymentData?.payment_amount)
                          : paymentData?.payment_amount,
                        'GHS'
                      )
                    : '-'}
                </Text>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <Controller
            control={form.control}
            name="payment_method"
            render={({ field }) => (
              <Combobox
                label="Payment Method"
                placeholder="Select payment method"
                options={[
                  { label: 'Bank Transfer', value: 'bank' },
                  { label: 'Mobile Money', value: 'mobile_money' },
                ]}
                value={field.value}
                onChange={(value: string) => {
                  field.onChange(value);
                }}
                error={form.formState.errors.payment_method?.message}
              />
            )}
          />

          {/* Bank Transfer Fields */}
          {form.watch('payment_method') === 'bank' && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <Controller
                control={form.control}
                name="bank_code"
                render={({ field }) => (
                  <div>
                    <Combobox
                      label="Bank"
                      value={field.value}
                      onChange={(value: string) => {
                        field.onChange(value);
                      }}
                      options={banks.map((bank: any) => ({
                        label: bank.label,
                        value: bank.value,
                      }))}
                      placeholder="Select bank"
                    />
                    {selectedBankName && (
                      <p className="mt-1 text-sm text-gray-600">
                        Selected: {selectedBankName}
                      </p>
                    )}
                  </div>
                )}
              />
              <div>
                <Input
                  label="Account Number"
                  {...form.register('account_number')}
                  placeholder="Enter account number"
                />
              </div>
            </div>
          )}

          {/* Mobile Money Fields */}
          {form.watch('payment_method') === 'mobile_money' && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <Controller
                control={form.control}
                name="mobile_money_provider"
                render={({ field }) => (
                  <Combobox
                    label="Mobile Money Provider"
                    placeholder="Select provider"
                    value={field.value}
                    onChange={(value: string) => field.onChange(value)}
                    options={[
                      { label: 'MTN Mobile Money', value: 'mtn' },
                      { label: 'Vodafone Cash', value: 'vodafone' },
                      { label: 'AirtelTigo Money', value: 'airtel' }, // Fixed value to match enum
                    ]}
                  />
                )}
              />
              <div>
                <Input
                  label="Mobile Money Number"
                  {...form.register('mobile_money_number')}
                  placeholder="Enter mobile money number"
                />
              </div>
            </div>
          )}

          {/* Transaction Details */}
          <div className="space-y-4">
            <div>
              <Input
                label="Payment Date"
                type="date"
                {...form.register('payment_date')}
                error={form.formState.errors.payment_date?.message}
                required
              />
            </div>

            <div>
              <Input
                label="Notes (Optional)"
                type="textarea"
                {...form.register('notes')}
                error={form.formState.errors.notes?.message}
                placeholder="Add any additional notes about this payment"
                rows={3}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              type="button"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="flex-1"
              loading={isProcessing}
              disabled={isProcessing}
            >
              <Icon icon="bi:check-circle" className="mr-2" />
              Process Payout
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
