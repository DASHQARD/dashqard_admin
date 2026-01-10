import { Button, CustomIcon, Modal, Text } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { MODALS } from '@/utils/constants';
import { vendorPaymentsManagementMutations } from '@/features/hooks/vendorPaymentsManagement';

type VendorPaymentData = {
  id: number | string;
  invoice_number?: string;
  vendor_name?: string;
  payment_amount?: string | number;
};

export function DeleteVendorPayment() {
  const modal = usePersistedModalState<VendorPaymentData>({
    paramName: MODALS.VENDOR_PAYMENT_MANAGEMENT.PARAM_NAME,
  });

  const { useDeleteVendorPayment } = vendorPaymentsManagementMutations();
  const deletePaymentMutation = useDeleteVendorPayment();

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
      title="Delete Vendor Payment"
      isOpen={modal.isModalOpen(
        MODALS.VENDOR_PAYMENT_MANAGEMENT.CHILDREN.DELETE
      )}
      setIsOpen={(isOpen) => {
        if (!isOpen) {
          modal.closeModal();
        }
      }}
      position="center"
      showClose={true}
    >
      <div className="p-6 flex flex-col gap-12">
        <div className="flex flex-col gap-4 items-center justify-center">
          <CustomIcon
            name={'OrangeWarningSign'}
            width={48}
            height={48}
            className="text-error"
          />
          <div className="flex flex-col gap-1">
            <Text variant="h3" className="text-center font-semibold">
              Delete Vendor Payment
            </Text>
            <p className="text-gray-600 text-center text-sm">
              Are you sure you want to delete this vendor payment? This action
              cannot be undone.
            </p>
            {payment?.invoice_number && (
              <span className="block mt-2 font-medium text-center">
                Invoice Number: {payment.invoice_number}
              </span>
            )}
            {payment?.vendor_name && (
              <span className="block mt-1 font-medium text-center">
                Vendor: {payment.vendor_name}
              </span>
            )}
            {payment?.payment_amount && (
              <span className="block mt-1 font-medium text-center">
                Amount: {payment.payment_amount}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant={'outline'}
            onClick={modal.closeModal}
            className="grow"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            loading={deletePaymentMutation.isPending}
            onClick={handleDelete}
            className="grow"
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}

