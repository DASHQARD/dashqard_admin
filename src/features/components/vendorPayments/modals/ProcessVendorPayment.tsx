import React from 'react';
import { Button, Modal, Text, Input, Combobox } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { MODALS } from '@/utils/constants';
import { useToast } from '@/hooks/useToast';
import {
  vendorPaymentsManagementMutations,
  vendorPaymentsManagementQueries,
} from '@/features/hooks/vendorPaymentsManagement';
import { paymentProviderConfigManagementQueries } from '@/features/hooks/paymentProviderConfigManagement';
import { PAYMENT_GATEWAY_OPTIONS } from '@/utils/constants';
import {
  Controller,
  type FieldErrors,
  type SubmitHandler,
} from 'react-hook-form';
import { Icon, useCustomForm } from '@/libs';
import { formatCurrency, formatDate } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PaymentFormSchema } from '@/utils/schemas/payment';
import type {
  VendorPaymentDetail,
  VendorPaymentMethodsMobileMoney,
} from '@/features/services/vendorPayments';

const MOBILE_PROVIDER_LABELS: Record<string, string> = {
  mtn: 'MTN Mobile Money',
  vodafone: 'Vodafone Cash',
  airtel: 'AirtelTigo Money',
  'airtel-tigo': 'AirtelTigo Money',
};

function normalizeInternationalPhone(value: string) {
  return value
    .replace(/^\+\s*/, '')
    .replace(/\s/g, '')
    .trim();
}

function formatMobileProvider(provider: string) {
  const key = provider?.toLowerCase?.() ?? '';
  return MOBILE_PROVIDER_LABELS[key] ?? provider.replace(/_/g, ' ');
}

function uniqueMobileMoney(items: VendorPaymentMethodsMobileMoney[]) {
  const seen = new Set<number>();
  return items.filter((row) => {
    if (seen.has(row.id)) return false;
    seen.add(row.id);
    return true;
  });
}

/** Map API / preference values to form payment_method */
function normalizeFormPaymentMethod(
  value: string | null | undefined
): 'bank' | 'mobile_money' {
  const v = (value ?? '').toLowerCase();
  if (v.includes('mobile') || v === 'momo') return 'mobile_money';
  if (v.includes('bank')) return 'bank';
  return 'bank';
}

function normalizeMobileProvider(provider: string | null | undefined) {
  const key = (provider ?? '').toLowerCase();
  if (key === 'airtel' || key === 'tigo') return 'airtel-tigo';
  if (key === 'mtn' || key === 'vodafone' || key === 'airtel-tigo') return key;
  return '';
}

export function ProcessVendorPayment() {
  const modal = usePersistedModalState<Pick<VendorPaymentDetail, 'id'>>({
    paramName: MODALS.VENDOR_PAYMENT_MANAGEMENT.PARAM_NAME,
  });

  const isOpen = modal.isModalOpen(
    MODALS.VENDOR_PAYMENT_MANAGEMENT.CHILDREN.CREATE
  );

  const { useProcessVendorPayment } = vendorPaymentsManagementMutations();
  const { mutate: processVendorPaymentMutate, isPending: isProcessing } =
    useProcessVendorPayment();

  const { useGetBanks, useGetVendorPaymentById } =
    vendorPaymentsManagementQueries();

  const { useGetPaymentProviderConfig } =
    paymentProviderConfigManagementQueries();
  const { data: paymentProviderConfig } = useGetPaymentProviderConfig({
    enabled: isOpen,
  });

  const systemPayoutLabel = React.useMemo(() => {
    const v = paymentProviderConfig?.payout_service;
    if (!v) return null;
    const found = PAYMENT_GATEWAY_OPTIONS.find((o) => o.value === v);
    return found?.label ?? v;
  }, [paymentProviderConfig?.payout_service]);

  const paymentIdFromModal = modal.modalData?.id;
  const paymentIdStr =
    paymentIdFromModal != null ? String(paymentIdFromModal) : '';

  const {
    data: paymentData,
    isLoading: isPaymentLoading,
    isError: isPaymentError,
    error: paymentError,
  } = useGetVendorPaymentById(paymentIdStr, {
    enabled: isOpen && Boolean(paymentIdStr),
  });

  const resolvedPaymentId = React.useMemo(() => {
    const candidate = paymentData?.id ?? paymentIdFromModal ?? paymentIdStr;
    if (candidate == null || candidate === '') return '';
    return String(candidate);
  }, [paymentData?.id, paymentIdFromModal, paymentIdStr]);

  const { data: banksData } = useGetBanks();

  const banks = React.useMemo(() => {
    if (!banksData) return [];
    return banksData.map((bank) => {
      const sortCode = bank.sortCode || bank.code;
      return {
        label: sortCode ? `${bank.name} — ${sortCode}` : bank.name,
        value: sortCode,
        name: bank.name,
        sortCode,
        code: bank.code,
      };
    });
  }, [banksData]);

  const mobileMoneyOnFile = React.useMemo(() => {
    const raw = paymentData?.payment_methods?.mobile_money ?? [];
    return uniqueMobileMoney(raw);
  }, [paymentData?.payment_methods?.mobile_money]);

  const bankAccountsOnFile = paymentData?.payment_methods?.bank_accounts ?? [];

  const hasContactPhones =
    Boolean(paymentData?.branch_phone_number) ||
    Boolean(paymentData?.branch_manager_phone_number);

  const hasOnFileMethods =
    mobileMoneyOnFile.length > 0 || bankAccountsOnFile.length > 0;

  const toast = useToast();

  const form = useCustomForm({
    resolver: zodResolver(PaymentFormSchema),
    defaultValues: {
      payment_method: 'bank',
      bank_code: '',
      account_number: '',
      mobile_money_provider: '',
      mobile_money_number: '',
      notes: '',
    },
  });

  // Get selected bank name for display
  const selectedBankCode = form.watch('bank_code');
  const selectedBank = React.useMemo(() => {
    if (!selectedBankCode || !banks.length) return null;
    return banks.find((b) => b.value === selectedBankCode) ?? null;
  }, [selectedBankCode, banks]);

  // Reset when modal opens or a different payment is loaded.
  // Do not put `form` in deps — useCustomForm returns a new object every render ({ ...formMethods }),
  // which would retrigger this effect and cause "Maximum update depth exceeded" with form.reset().
  React.useEffect(() => {
    if (!isOpen || !paymentData) return;

    const method = normalizeFormPaymentMethod(paymentData.payment_method);
    const firstBank = paymentData.payment_methods?.bank_accounts?.[0];
    const firstMobile = uniqueMobileMoney(
      paymentData.payment_methods?.mobile_money ?? []
    )[0];

    form.reset({
      payment_method: method,
      bank_code: '',
      account_number: firstBank?.account_number ?? '',
      mobile_money_provider: firstMobile
        ? normalizeMobileProvider(firstMobile.provider)
        : '',
      mobile_money_number: firstMobile?.number ?? '',
      notes: paymentData.notes ?? '',
    });
    // form: identity changes every render from useCustomForm; paymentData: use id/fields instead of object ref
    // eslint-disable-next-line react-hooks/exhaustive-deps -- see comment above
  }, [
    isOpen,
    paymentData?.id,
    paymentData?.notes,
    paymentData?.payment_method,
  ]);

  const onInvalid = React.useCallback(
    (errors: FieldErrors<z.infer<typeof PaymentFormSchema>>) => {
      const firstMessage =
        errors.payment_method?.message ||
        errors.bank_code?.message ||
        errors.account_number?.message ||
        errors.mobile_money_provider?.message ||
        errors.mobile_money_number?.message ||
        errors.notes?.message;
      if (firstMessage) {
        toast.error(String(firstMessage));
      }
    },
    [toast]
  );

  const onSubmit: SubmitHandler<z.infer<typeof PaymentFormSchema>> = (data) => {
    if (!paymentData) return;

    if (!resolvedPaymentId) {
      toast.error('Missing payment id. Close and open process payment again.');
      return;
    }

    const notes = (data.notes ?? '').trim();
    const base = {
      id: resolvedPaymentId,
      payment_date: new Date().toISOString(),
      ...(notes ? { notes } : {}),
    };

    if (data.payment_method === 'bank') {
      processVendorPaymentMutate(
        {
          ...base,
          payment_method: 'bank',
          bank_code: data.bank_code ?? '',
          account_number: (data.account_number ?? '').replace(/\s/g, ''),
        },
        {
          onSuccess: () => {
            modal.closeModal();
            form.reset();
          },
          onError: (error: Error) => {
            toast.error(error.message || 'Failed to process payment');
          },
        }
      );
      return;
    }

    processVendorPaymentMutate(
      {
        ...base,
        payment_method: 'mobile_money',
        mobile_money_number: normalizeInternationalPhone(
          data.mobile_money_number ?? ''
        ),
        mobile_money_provider: data.mobile_money_provider ?? '',
      },
      {
        onSuccess: () => {
          modal.closeModal();
          form.reset();
        },
        onError: (error: Error) => {
          toast.error(error.message || 'Failed to process payment');
        },
      }
    );
  };

  const handleClose = React.useCallback(() => {
    modal.closeModal();
    setTimeout(() => form.reset(), 0);
  }, [modal, form]);

  const handleSetIsOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        handleClose();
      }
    },
    [handleClose]
  );

  if (!isOpen) return null;

  return (
    <Modal
      panelClass="!w-[700px] max-w-[90vw]"
      title="Process Vendor Payout"
      isOpen={isOpen}
      setIsOpen={handleSetIsOpen}
      position="side"
      showClose={true}
    >
      {isPaymentLoading ? (
        <div className="px-6 py-16 flex flex-col items-center justify-center gap-3">
          <Icon
            icon="svg-spinners:ring-resize"
            className="text-4xl text-primary-600"
          />
          <Text variant="p" className="text-gray-600">
            Loading payment details…
          </Text>
        </div>
      ) : isPaymentError || !paymentData ? (
        <div className="px-6 py-8 flex flex-col gap-4">
          <Text variant="p" className="text-gray-600">
            {!paymentIdStr
              ? 'Missing payment id. Close and open process payment again.'
              : (paymentError as { message?: string })?.message ||
                'Could not load payment details. Close and try again.'}
          </Text>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </div>
      ) : (
        <form
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          className="flex flex-col h-full"
        >
          <div className="h-full px-6 flex flex-col gap-6 justify-between">
            <div className="grow overflow-y-auto py-6">
              <div className="space-y-6">
                {/* Payment Summary Section */}
                <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2 mb-4">
                    <Icon
                      icon="bi:info-circle"
                      className="text-blue-600 text-xl"
                    />
                    <Text
                      variant="h6"
                      weight="semibold"
                      className="text-blue-900"
                    >
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
                      <p className="text-xs text-gray-600 mb-1">
                        Invoice Number
                      </p>
                      <Text
                        variant="span"
                        weight="semibold"
                        className="text-gray-800"
                      >
                        {paymentData?.invoice_number || '-'}
                      </Text>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">
                        Payment Frequency
                      </p>
                      <Text
                        variant="span"
                        weight="normal"
                        className="text-gray-800"
                      >
                        {paymentData?.payment_frequency || '-'}
                      </Text>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">
                        Payment Period
                      </p>
                      <Text
                        variant="span"
                        weight="normal"
                        className="text-gray-800"
                      >
                        {paymentData?.payment_period || '-'}
                      </Text>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Due Date</p>
                      <Text
                        variant="span"
                        weight="normal"
                        className="text-gray-800"
                      >
                        {paymentData?.due_date
                          ? formatDate(paymentData.due_date)
                          : '-'}
                      </Text>
                    </div>
                    <div className="col-span-2 pt-2 border-t border-blue-200">
                      <p className="text-xs text-gray-600 mb-1">
                        Amount to Pay
                      </p>
                      <Text
                        variant="h4"
                        weight="bold"
                        className="text-blue-700"
                      >
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

                {/* Vendor payout methods & contact (from API) */}
                <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon
                      icon="bi:wallet2"
                      className="text-emerald-600 text-xl"
                    />
                    <Text
                      variant="h6"
                      weight="semibold"
                      className="text-gray-900"
                    >
                      Vendor payment methods
                    </Text>
                  </div>
                  <Text
                    variant="span"
                    className="text-gray-500 text-sm block mb-4"
                  >
                    Registered payout destinations and contact numbers for this
                    vendor.
                  </Text>

                  {paymentData?.payment_method ? (
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Preferred on record
                      </span>
                      <span className="text-xs font-medium rounded-full bg-emerald-50 px-2.5 py-0.5 text-emerald-800 capitalize">
                        {paymentData.payment_method.replace(/_/g, ' ')}
                      </span>
                    </div>
                  ) : null}

                  {(hasContactPhones || hasOnFileMethods) && (
                    <div className="space-y-4">
                      {hasContactPhones && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                            Contact
                          </p>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {paymentData.branch_phone_number ? (
                              <div className="flex items-start gap-2 rounded-md bg-gray-50 px-3 py-2">
                                <Icon
                                  icon="bi:telephone"
                                  className="text-gray-500 mt-0.5 shrink-0"
                                />
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Branch
                                  </p>
                                  <Text
                                    variant="span"
                                    weight="medium"
                                    className="text-gray-800"
                                  >
                                    {paymentData.branch_phone_number}
                                  </Text>
                                </div>
                              </div>
                            ) : null}
                            {paymentData.branch_manager_phone_number ? (
                              <div className="flex items-start gap-2 rounded-md bg-gray-50 px-3 py-2">
                                <Icon
                                  icon="bi:person-badge"
                                  className="text-gray-500 mt-0.5 shrink-0"
                                />
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Branch manager
                                  </p>
                                  <Text
                                    variant="span"
                                    weight="medium"
                                    className="text-gray-800"
                                  >
                                    {paymentData.branch_manager_phone_number}
                                  </Text>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      )}

                      {mobileMoneyOnFile.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                            Mobile money on file
                          </p>
                          <ul className="space-y-2">
                            {mobileMoneyOnFile.map((mm) => (
                              <li
                                key={mm.id}
                                className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-gray-100 bg-gray-50/80 px-3 py-2.5"
                              >
                                <span className="text-xs font-medium rounded bg-white px-2 py-0.5 text-gray-700 shadow-sm ring-1 ring-gray-200 ring-inset">
                                  {formatMobileProvider(mm.provider)}
                                </span>
                                <Text
                                  variant="span"
                                  weight="medium"
                                  className="text-gray-900 font-mono text-sm"
                                >
                                  {mm.number}
                                </Text>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {bankAccountsOnFile.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                            Bank accounts on file
                          </p>
                          <ul className="space-y-2">
                            {bankAccountsOnFile.map((acc, index) => (
                              <li
                                key={acc.id ?? index}
                                className="rounded-md border border-gray-100 bg-gray-50/80 px-3 py-2.5"
                              >
                                <span className="text-sm font-medium text-gray-900">
                                  {acc.bank_name ?? 'Bank account'}
                                </span>
                                {acc.account_name ? (
                                  <p className="text-xs text-gray-600 mt-0.5">
                                    {acc.account_name}
                                  </p>
                                ) : null}
                                {acc.sort_code || acc.bank_code ? (
                                  <p className="text-xs font-mono text-gray-600 mt-0.5">
                                    Sort code:{' '}
                                    {String(acc.sort_code ?? acc.bank_code)}
                                  </p>
                                ) : null}
                                {acc.account_number ? (
                                  <p className="text-xs font-mono text-gray-600 mt-0.5">
                                    Account: {acc.account_number}
                                  </p>
                                ) : null}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {!hasContactPhones &&
                  !hasOnFileMethods &&
                  !paymentData?.payment_method ? (
                    <div className="rounded-md border border-dashed border-gray-200 bg-gray-50/50 px-4 py-3 text-center">
                      <Text variant="span" className="text-gray-500 text-sm">
                        No payment methods or phone numbers on file for this
                        vendor.
                      </Text>
                    </div>
                  ) : null}
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
                      onChange={field.onChange}
                      error={form.formState.errors.payment_method?.message}
                    />
                  )}
                />

                <div className="rounded-md border border-blue-100 bg-blue-50/80 px-4 py-3">
                  <Text variant="span" className="text-sm text-blue-900">
                    {systemPayoutLabel
                      ? `Payout gateway (from system config): ${systemPayoutLabel}. Select a bank by its sort / package code — that value is sent as bank_code for the payout.`
                      : 'The active payout gateway is read from Payment Provider Config. Configure it there if payouts fail.'}
                  </Text>
                </div>

                {/* Bank Transfer Fields */}
                {form.watch('payment_method') === 'bank' && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <Controller
                      control={form.control}
                      name="bank_code"
                      render={({ field }) => (
                        <div>
                          <Combobox
                            label="Bank (sort / package code)"
                            value={field.value}
                            onChange={field.onChange}
                            options={banks.map((bank) => ({
                              label: bank.label,
                              value: bank.value,
                            }))}
                            placeholder="Select bank"
                            error={form.formState.errors.bank_code?.message}
                          />
                          {selectedBank ? (
                            <div className="mt-2 rounded-md bg-white px-3 py-2 text-sm text-gray-600 ring-1 ring-gray-200 ring-inset">
                              <p>
                                <span className="font-medium text-gray-800">
                                  {selectedBank.name}
                                </span>
                              </p>
                              <p className="mt-0.5 font-mono text-xs">
                                Sort code: {selectedBank.sortCode}
                              </p>
                            </div>
                          ) : null}
                        </div>
                      )}
                    />
                    <div>
                      <Input
                        label="Account Number"
                        {...form.register('account_number')}
                        error={form.formState.errors.account_number?.message}
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
                          onChange={field.onChange}
                          error={
                            form.formState.errors.mobile_money_provider?.message
                          }
                          options={[
                            { label: 'MTN Mobile Money', value: 'mtn' },
                            { label: 'Vodafone Cash', value: 'vodafone' },
                            {
                              label: 'AirtelTigo Money',
                              value: 'airtel-tigo',
                            },
                          ]}
                        />
                      )}
                    />
                    <div>
                      <Input
                        label="Mobile Money Number"
                        {...form.register('mobile_money_number')}
                        error={
                          form.formState.errors.mobile_money_number?.message
                        }
                        placeholder="e.g. 233559617908 or +233559617908"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <Input
                    label="Notes (Optional)"
                    type="textarea"
                    {...form.register('notes')}
                    error={form.formState.errors.notes?.message}
                    placeholder="Add any additional notes about this payment"
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200 justify-end shrink-0 pb-6">
              <Button variant="outline" type="button" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                loading={isProcessing}
                disabled={isProcessing}
              >
                <Icon icon="bi:check-circle" className="mr-2" />
                Process Payout
              </Button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
}
