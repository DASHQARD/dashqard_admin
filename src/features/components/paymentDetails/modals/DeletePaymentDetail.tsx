import { Button, Modal, Text } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { MODALS } from '@/utils/constants';
import { paymentDetailsManagementMutations } from '@/features/hooks/paymentDetailsManagement';

type PaymentDetailsData = {
  id: number | string;
  payment_reference?: string;
  transaction_id?: string;
  amount?: string | number;
  status?: string;
};

export function DeletePaymentDetail() {
  const modal = usePersistedModalState<PaymentDetailsData>({
    paramName: MODALS.PAYMENT_DETAILS_MANAGEMENT.PARAM_NAME,
  });

  const { useDeletePaymentDetail } = paymentDetailsManagementMutations();
  const deletePaymentDetailMutation = useDeletePaymentDetail();

  const paymentDetail = modal.modalData;

  const handleDelete = () => {
    if (!paymentDetail?.id) return;

    deletePaymentDetailMutation.mutate(String(paymentDetail.id), {
      onSuccess: () => {
        modal.closeModal();
      },
    });
  };

  return (
    <Modal
      panelClass="!w-[500px]"
      title="Delete Payment Detail"
      isOpen={modal.isModalOpen(
        MODALS.PAYMENT_DETAILS_MANAGEMENT.CHILDREN.DELETE
      )}
      setIsOpen={(isOpen) => {
        if (!isOpen) {
          modal.closeModal();
        }
      }}
      position="center"
    >
      <div className="p-6 flex flex-col gap-6">
        <Text variant="p" className="text-gray-700">
          Are you sure you want to delete this payment detail? This action
          cannot be undone.
          {paymentDetail?.payment_reference && (
            <span className="block mt-2 font-medium">
              Payment Reference: {paymentDetail.payment_reference}
            </span>
          )}
        </Text>

        <div className="flex gap-4 justify-end pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => modal.closeModal()}
            disabled={deletePaymentDetailMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleDelete}
            disabled={deletePaymentDetailMutation.isPending}
            className="bg-error hover:bg-error/90 text-white"
          >
            {deletePaymentDetailMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
