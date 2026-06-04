import { Button, Modal, Tag, Text } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { MODALS } from '@/utils/constants';
import { formatDate, getStatusVariant } from '@/utils/helpers';
import { paymentsManagementQueries } from '@/features/hooks/paymentsManagement';
import React from 'react';

type PaymentData = {
  id: number | string;
  trans_id?: string;
  receipt_number?: string;
  amount?: string | number;
  currency?: string;
  status?: string;
  type?: string;
  user_id?: number | string;
  user_name?: string;
  phone?: string;
  user_type?: string;
  cart_id?: number | string | null;
  cart_details?: any;
  created_at?: string;
  updated_at?: string;
};

export function ViewPayment() {
  const modal = usePersistedModalState<PaymentData>({
    paramName: MODALS.PAYMENTS_MANAGEMENT.PARAM_NAME,
  });

  const paymentData = modal.modalData;

  const { useGetPaymentById } = paymentsManagementQueries();
  const paymentId = String(paymentData?.id || '');
  const { data: paymentDetails, isLoading } = useGetPaymentById(paymentId);

  const payment = React.useMemo(() => {
    return paymentDetails ?? null;
  }, [paymentDetails]);

  if (isLoading) {
    return (
      <Modal
        panelClass="!w-[680px] min-w-full"
        title="Payment Details"
        isOpen={modal.isModalOpen(MODALS.PAYMENTS_MANAGEMENT.CHILDREN.VIEW)}
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

  if (!payment) {
    return (
      <Modal
        panelClass="!w-[680px] min-w-full"
        title="Payment Details"
        isOpen={modal.isModalOpen(MODALS.PAYMENTS_MANAGEMENT.CHILDREN.VIEW)}
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
      title="Payment Details"
      isOpen={modal.isModalOpen(MODALS.PAYMENTS_MANAGEMENT.CHILDREN.VIEW)}
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
                value={payment.status || 'Pending'}
                variant={getStatusVariant(payment.status || 'pending')}
                className="w-fit"
              />
            </div>

            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">Payment ID</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {payment.id || '-'}
              </Text>
            </div>

            {payment.trans_id && (
              <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
                <p className="text-gray-400 text-xs">Transaction ID</p>
                <Text variant="span" weight="normal" className="text-gray-800">
                  {payment.trans_id}
                </Text>
              </div>
            )}

            {payment.receipt_number && (
              <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
                <p className="text-gray-400 text-xs">Receipt Number</p>
                <Text variant="span" weight="normal" className="text-gray-800">
                  {payment.receipt_number}
                </Text>
              </div>
            )}

            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">Amount</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {payment.amount
                  ? `${payment.currency || ''} ${payment.amount}`.trim()
                  : '-'}
              </Text>
            </div>

            {payment.type && (
              <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
                <p className="text-gray-400 text-xs">Type</p>
                <Text variant="span" weight="normal" className="text-gray-800">
                  {payment.type}
                </Text>
              </div>
            )}

            {payment.user_name && (
              <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
                <p className="text-gray-400 text-xs">User Name</p>
                <Text variant="span" weight="normal" className="text-gray-800">
                  {payment.user_name}
                </Text>
              </div>
            )}

            {payment.user_id && (
              <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
                <p className="text-gray-400 text-xs">User ID</p>
                <Text variant="span" weight="normal" className="text-gray-800">
                  {payment.user_id}
                </Text>
              </div>
            )}

            {payment.phone && (
              <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
                <p className="text-gray-400 text-xs">Phone</p>
                <Text variant="span" weight="normal" className="text-gray-800">
                  {payment.phone}
                </Text>
              </div>
            )}

            {payment.user_type && (
              <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
                <p className="text-gray-400 text-xs">User Type</p>
                <Text variant="span" weight="normal" className="text-gray-800">
                  {payment.user_type}
                </Text>
              </div>
            )}

            {payment.cart_id && (
              <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
                <p className="text-gray-400 text-xs">Cart ID</p>
                <Text variant="span" weight="normal" className="text-gray-800">
                  {payment.cart_id}
                </Text>
              </div>
            )}

            {payment.created_at && (
              <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
                <p className="text-gray-400 text-xs">Created At</p>
                <Text variant="span" weight="normal" className="text-gray-800">
                  {formatDate(payment.created_at, 'DD MMM YYYY, HH:mm')}
                </Text>
              </div>
            )}

            {payment.updated_at && (
              <div className="flex flex-col gap-1">
                <p className="text-gray-400 text-xs">Updated At</p>
                <Text variant="span" weight="normal" className="text-gray-800">
                  {formatDate(payment.updated_at, 'DD MMM YYYY, HH:mm')}
                </Text>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4 justify-end pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={modal.closeModal}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
