import { Button, CustomIcon, Modal, Text } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { MODALS } from '@/utils';
import { vendorManagementMutations } from '@/features/hooks/vendorManagement/vendorMutations';

export function ActivateVendor() {
  const modal = usePersistedModalState<{ vendor_account_id: number }>({
    paramName: MODALS.VENDOR_MANAGEMENT.CHILDREN.ACTIVATE,
  });
  const { useUpdateVendorStatus } = vendorManagementMutations();
  const activateMutation = useUpdateVendorStatus();

  const onSubmit = () => {
    activateMutation.mutate(
      {
        vendor_account_id: modal.modalData?.vendor_account_id || 0,
        status: 'active',
      },
      {
        onSuccess: () => {
          modal.closeModal();
        },
      }
    );
  };

  return (
    <Modal
      panelClass=" "
      isOpen={modal.isModalOpen(MODALS.VENDOR_MANAGEMENT.CHILDREN.ACTIVATE)}
      setIsOpen={(isOpen) => {
        if (!isOpen) {
          modal.closeModal();
        }
      }}
      position="center"
    >
      <div className="p-6">
        <div className="space-y-4 flex flex-col items-center justify-center">
          <CustomIcon
            name={'CheckMarkCircle'}
            width={48}
            height={48}
            className="text-success"
          />
          <div>
            <Text
              variant="h3"
              className="text-center font-semibold capitalize"
            >
              Activate Vendor
            </Text>
            <p className="mt-4 mx-6 mb-12 text-[#5F6166] text-center">
              Are you sure you want to activate this vendor? Confirm action
              below
            </p>
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
            variant="secondary"
            loading={activateMutation.isPending}
            className="grow"
            onClick={onSubmit}
          >
            Activate
          </Button>
        </div>
      </div>
    </Modal>
  );
}