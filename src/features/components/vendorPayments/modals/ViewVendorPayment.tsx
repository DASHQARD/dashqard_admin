import React from 'react';
import { Modal, Tag, Text } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { MODALS } from '@/utils/constants';
import { formatDate, getStatusVariant } from '@/utils/helpers';
import { formatCurrency } from '@/utils';

type VendorPaymentData = {
  id: string;
  vendor_name?: string;
  business_name?: string;
  amount?: number;
  payment_period?: string;
  status?: string;
  due_date?: string;
  paid_date?: string | null;
  vendor_id?: string;
  invoice_number?: string;
  description?: string;
};

export function ViewVendorPayment() {
  const modal = usePersistedModalState<VendorPaymentData>({
    paramName: MODALS.VENDOR_PAYMENT_MANAGEMENT.PARAM_NAME,
  });

  const paymentData = modal.modalData;
  const isOpen = modal.isModalOpen(
    MODALS.VENDOR_PAYMENT_MANAGEMENT.CHILDREN.VIEW
  );

  // Debug logging
  React.useEffect(() => {
    console.log('ViewVendorPayment modal state:', {
      isOpen,
      modalState: modal.modalState,
      expectedModal: MODALS.VENDOR_PAYMENT_MANAGEMENT.CHILDREN.VIEW,
      paymentData,
      paramName: MODALS.VENDOR_PAYMENT_MANAGEMENT.PARAM_NAME,
    });
  }, [isOpen, modal.modalState, paymentData]);

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
      {!paymentData ? (
        <div className="h-full px-6 flex flex-col gap-6 justify-center items-center">
          <Text variant="span">No payment data found</Text>
        </div>
      ) : (
        <div className="h-full px-6 flex flex-col gap-6 justify-between">
          <div className="grow overflow-y-auto py-6">
            <div className="space-y-4">
              <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
                <p className="text-gray-400 text-xs">Status</p>
                <Tag
                  value={paymentData.status || 'Pending'}
                  variant={getStatusVariant(paymentData.status || 'pending')}
                  className="w-fit"
                />
              </div>

              <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
                <p className="text-gray-400 text-xs">Invoice Number</p>
                <Text variant="span" weight="normal" className="text-gray-800">
                  {paymentData.invoice_number || '-'}
                </Text>
              </div>

              <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
                <p className="text-gray-400 text-xs">Vendor ID</p>
                <Text variant="span" weight="normal" className="text-gray-800">
                  {paymentData.vendor_id || '-'}
                </Text>
              </div>

              <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
                <p className="text-gray-400 text-xs">Vendor Name</p>
                <Text variant="span" weight="normal" className="text-gray-800">
                  {paymentData.vendor_name || '-'}
                </Text>
              </div>

              <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
                <p className="text-gray-400 text-xs">Business Name</p>
                <Text variant="span" weight="normal" className="text-gray-800">
                  {paymentData.business_name || '-'}
                </Text>
              </div>

              <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
                <p className="text-gray-400 text-xs">Payment Amount</p>
                <Text
                  variant="span"
                  weight="semibold"
                  className="text-gray-800 text-lg"
                >
                  {paymentData.amount
                    ? formatCurrency(paymentData.amount, 'GHS')
                    : '-'}
                </Text>
              </div>

              <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
                <p className="text-gray-400 text-xs">Payment Period</p>
                <Text variant="span" weight="normal" className="text-gray-800">
                  {paymentData.payment_period || '-'}
                </Text>
              </div>

              <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
                <p className="text-gray-400 text-xs">Due Date</p>
                <Text variant="span" weight="normal" className="text-gray-800">
                  {paymentData.due_date
                    ? formatDate(paymentData.due_date)
                    : '-'}
                </Text>
              </div>

              {paymentData.paid_date && (
                <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
                  <p className="text-gray-400 text-xs">Paid Date</p>
                  <Text
                    variant="span"
                    weight="normal"
                    className="text-gray-800"
                  >
                    {formatDate(paymentData.paid_date)}
                  </Text>
                </div>
              )}

              {paymentData.description && (
                <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
                  <p className="text-gray-400 text-xs">Description</p>
                  <Text
                    variant="span"
                    weight="normal"
                    className="text-gray-800"
                  >
                    {paymentData.description}
                  </Text>
                </div>
              )}

              <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
                <p className="text-gray-400 text-xs">Payment ID</p>
                <Text variant="span" weight="normal" className="text-gray-800">
                  {paymentData.id || '-'}
                </Text>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
