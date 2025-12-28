import { Button, Modal, Text } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { MODALS } from '@/utils/constants';
import { paymentsManagementMutations } from '@/features/hooks/paymentsManagement';

type PaymentData = {
  id: number | string;
  trans_id?: string;
  receipt_number?: string;
  amount?: string | number;
  status?: string;
};

export function DeletePayment() {
  const modal = usePersistedModalState<PaymentData>({
    paramName: MODALS.PAYMENTS_MANAGEMENT.PARAM_NAME,
  });

  const { useDeletePayment } = paymentsManagementMutations();
  const deletePaymentMutation = useDeletePayment();

  const payment = modal.modalData;

  const handleDelete = () => {
    if (!payment?.id) return;

    deletePaymentMutation.mutate(String(payment.id), {
      onSuccess: () => {
        modal.closeModal();
      },
    });
  };

  return (
    <Modal
      panelClass="!w-[500px]"
      title="Delete Payment"
      isOpen={modal.isModalOpen(MODALS.PAYMENTS_MANAGEMENT.CHILDREN.DELETE)}
      setIsOpen={(isOpen) => {
        if (!isOpen) {
          modal.closeModal();
        }
      }}
      position="center"
    >
      <div className="p-6 flex flex-col gap-6">
        <Text variant="span" className="text-gray-700">
          Are you sure you want to delete this payment? This action cannot be
          undone.
          {payment?.trans_id && (
            <span className="block mt-2 font-medium">
              Transaction ID: {payment.trans_id}
            </span>
          )}
          {payment?.receipt_number && (
            <span className="block mt-1 font-medium">
              Receipt Number: {payment.receipt_number}
            </span>
          )}
        </Text>

        <div className="flex gap-4 justify-end pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => modal.closeModal()}
            disabled={deletePaymentMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleDelete}
            disabled={deletePaymentMutation.isPending}
            className="bg-error hover:bg-error/90 text-white"
          >
            {deletePaymentMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
