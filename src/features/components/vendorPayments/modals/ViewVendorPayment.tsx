import React from 'react';
import { Modal, Tag, Text } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { MODALS } from '@/utils/constants';
import { formatDate, getStatusVariant } from '@/utils/helpers';
import { formatCurrency } from '@/utils';
import { Icon } from '@/libs';
import { vendorPaymentsManagementQueries } from '@/features/hooks/vendorPaymentsManagement';

type MobileMoneyAccount = {
  provider?: string;
  number?: string;
};

type BankAccount = {
  bank_name?: string;
  bank_branch?: string;
  account_name?: string;
  account_number?: string;
  swift_code?: string;
  sort_code?: string;
};

type VendorPaymentData = {
  id: number | string;
  vendor_id?: number | string;
  vendor_user_id?: number;
  vendor_name?: string;
  vendor_gvid?: string;
  payment_frequency?: string;
  branch_location?: string;
  branch_id?: number;
  payment_amount?: string | number;
  payment_period?: string;
  status?: string;
  due_date?: string;
  paid_date?: string | null;
  invoice_number?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  payment_methods?: {
    bank_accounts?: BankAccount[];
    mobile_money?: MobileMoneyAccount[];
  };
};

export function ViewVendorPayment() {
  const modal = usePersistedModalState<VendorPaymentData>({
    paramName: MODALS.VENDOR_PAYMENT_MANAGEMENT.PARAM_NAME,
  });

  const paymentData = modal.modalData;
  const isOpen = modal.isModalOpen(
    MODALS.VENDOR_PAYMENT_MANAGEMENT.CHILDREN.VIEW
  );

  const { useGetVendorPaymentById } = vendorPaymentsManagementQueries();
  const paymentId = String(paymentData?.id || '');
  const { data: paymentDetails, isLoading } =
    useGetVendorPaymentById(paymentId);

  const displayData = React.useMemo(() => {
    // Use API data if available, otherwise fallback to modal data
    if (paymentDetails) {
      // Handle response structure: { data: {...} } or direct object
      const data = paymentDetails?.data || paymentDetails || paymentData;
      return data;
    }
    return paymentData;
  }, [paymentDetails, paymentData]);

  // Get payment amount - handle both payment_amount (API) and amount (legacy)
  const paymentAmount = displayData?.payment_amount || displayData?.amount;

  if (isLoading) {
    return (
      <Modal
        panelClass="!w-[680px] min-w-full"
        title="Vendor Payment Details"
        isOpen={isOpen}
        setIsOpen={(isOpen) => {
          if (!isOpen) {
            modal.closeModal();
          }
        }}
        position="side"
        showClose={true}
      >
        <div className="h-full px-6 flex flex-col gap-6 justify-center items-center">
          <Text variant="span">Loading payment details...</Text>
        </div>
      </Modal>
    );
  }

  if (!displayData) {
    return (
      <Modal
        panelClass="!w-[680px] min-w-full"
        title="Vendor Payment Details"
        isOpen={isOpen}
        setIsOpen={(isOpen) => {
          if (!isOpen) {
            modal.closeModal();
          }
        }}
        position="side"
        showClose={true}
      >
        <div className="h-full px-6 flex flex-col gap-6 justify-center items-center">
          <Text variant="span">No payment data found</Text>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      panelClass="!w-[680px] min-w-full"
      title="Vendor Payment Details"
      isOpen={isOpen}
      setIsOpen={(isOpen) => {
        if (!isOpen) {
          modal.closeModal();
        }
      }}
      position="side"
      showClose={true}
    >
      <div className="h-full px-6 flex flex-col gap-6 justify-between">
        <div className="grow overflow-y-auto py-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">Status</p>
              <Tag
                value={displayData.status || 'Pending'}
                variant={getStatusVariant(displayData.status || 'pending')}
                className="w-fit"
              />
            </div>

            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">Invoice Number</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {displayData.invoice_number || '-'}
              </Text>
            </div>

            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">Vendor ID</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {displayData.vendor_id || '-'}
              </Text>
            </div>

            {displayData.vendor_gvid && (
              <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
                <p className="text-gray-400 text-xs">Vendor GVID</p>
                <Text variant="span" weight="normal" className="text-gray-800">
                  {displayData.vendor_gvid}
                </Text>
              </div>
            )}

            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">Vendor Name</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {displayData.vendor_name || '-'}
              </Text>
            </div>

            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">Payment Frequency</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {displayData.payment_frequency || '-'}
              </Text>
            </div>

            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">Branch Location</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {displayData.branch_location || '-'}
              </Text>
            </div>

            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">Payment Amount</p>
              <Text
                variant="span"
                weight="semibold"
                className="text-gray-800 text-lg"
              >
                {paymentAmount
                  ? formatCurrency(
                      typeof paymentAmount === 'string'
                        ? parseFloat(paymentAmount)
                        : paymentAmount,
                      'GHS'
                    )
                  : '-'}
              </Text>
            </div>

            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">Payment Period</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {displayData.payment_period || '-'}
              </Text>
            </div>

            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">Due Date</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {displayData.due_date ? formatDate(displayData.due_date) : '-'}
              </Text>
            </div>

            {displayData.paid_date && (
              <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
                <p className="text-gray-400 text-xs">Paid Date</p>
                <Text variant="span" weight="normal" className="text-gray-800">
                  {formatDate(displayData.paid_date)}
                </Text>
              </div>
            )}

            {displayData.description && (
              <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
                <p className="text-gray-400 text-xs">Description</p>
                <Text variant="span" weight="normal" className="text-gray-800">
                  {displayData.description}
                </Text>
              </div>
            )}

            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">Payment ID</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {displayData.id || '-'}
              </Text>
            </div>
          </div>

          {/* Vendor Payment Method Details */}
          {displayData.payment_methods &&
            (displayData.payment_methods.mobile_money?.length > 0 ||
              displayData.payment_methods.bank_accounts?.length > 0) && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <Icon icon="bi:wallet2" className="text-primary-600" />
                  <Text
                    variant="h6"
                    weight="semibold"
                    className="text-gray-900"
                  >
                    Vendor Payment Methods
                  </Text>
                </div>
                <div className="space-y-4">
                  {/* Mobile Money Accounts */}
                  {displayData.payment_methods.mobile_money &&
                    displayData.payment_methods.mobile_money.length > 0 &&
                    displayData.payment_methods.mobile_money.map(
                      (account: MobileMoneyAccount, index: number) => (
                        <div
                          key={index}
                          className="p-4 bg-gray-50 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <Icon
                              icon="bi:phone"
                              className="text-primary-600"
                            />
                            <Text
                              variant="span"
                              weight="semibold"
                              className="text-gray-900"
                            >
                              Mobile Money
                              {displayData.payment_methods.mobile_money.length >
                                1 && ` ${index + 1}`}
                            </Text>
                          </div>
                          <div className="space-y-2">
                            {account.provider && (
                              <div className="flex flex-col gap-1">
                                <p className="text-gray-400 text-xs">
                                  Provider
                                </p>
                                <Text
                                  variant="span"
                                  weight="normal"
                                  className="text-gray-800"
                                >
                                  {account.provider}
                                </Text>
                              </div>
                            )}
                            {account.number && (
                              <div className="flex flex-col gap-1">
                                <p className="text-gray-400 text-xs">
                                  Mobile Money Number
                                </p>
                                <Text
                                  variant="span"
                                  weight="normal"
                                  className="text-gray-800"
                                >
                                  {account.number}
                                </Text>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    )}

                  {/* Bank Accounts */}
                  {displayData.payment_methods.bank_accounts &&
                    displayData.payment_methods.bank_accounts.length > 0 &&
                    displayData.payment_methods.bank_accounts.map(
                      (account: BankAccount, index: number) => (
                        <div
                          key={index}
                          className="p-4 bg-gray-50 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <Icon icon="bi:bank" className="text-primary-600" />
                            <Text
                              variant="span"
                              weight="semibold"
                              className="text-gray-900"
                            >
                              Bank Account
                              {displayData.payment_methods.bank_accounts
                                .length > 1 && ` ${index + 1}`}
                            </Text>
                          </div>
                          <div className="space-y-2">
                            {account.bank_name && (
                              <div className="flex flex-col gap-1">
                                <p className="text-gray-400 text-xs">
                                  Bank Name
                                </p>
                                <Text
                                  variant="span"
                                  weight="normal"
                                  className="text-gray-800"
                                >
                                  {account.bank_name}
                                </Text>
                              </div>
                            )}
                            {account.bank_branch && (
                              <div className="flex flex-col gap-1">
                                <p className="text-gray-400 text-xs">Branch</p>
                                <Text
                                  variant="span"
                                  weight="normal"
                                  className="text-gray-800"
                                >
                                  {account.bank_branch}
                                </Text>
                              </div>
                            )}
                            {account.account_name && (
                              <div className="flex flex-col gap-1">
                                <p className="text-gray-400 text-xs">
                                  Account Name
                                </p>
                                <Text
                                  variant="span"
                                  weight="normal"
                                  className="text-gray-800"
                                >
                                  {account.account_name}
                                </Text>
                              </div>
                            )}
                            {account.account_number && (
                              <div className="flex flex-col gap-1">
                                <p className="text-gray-400 text-xs">
                                  Account Number
                                </p>
                                <Text
                                  variant="span"
                                  weight="normal"
                                  className="text-gray-800"
                                >
                                  {account.account_number}
                                </Text>
                              </div>
                            )}
                            {account.swift_code && (
                              <div className="flex flex-col gap-1">
                                <p className="text-gray-400 text-xs">
                                  SWIFT Code
                                </p>
                                <Text
                                  variant="span"
                                  weight="normal"
                                  className="text-gray-800"
                                >
                                  {account.swift_code}
                                </Text>
                              </div>
                            )}
                            {account.sort_code && (
                              <div className="flex flex-col gap-1">
                                <p className="text-gray-400 text-xs">
                                  Sort Code
                                </p>
                                <Text
                                  variant="span"
                                  weight="normal"
                                  className="text-gray-800"
                                >
                                  {account.sort_code}
                                </Text>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    )}
                </div>
              </div>
            )}
        </div>
      </div>
    </Modal>
  );
}
