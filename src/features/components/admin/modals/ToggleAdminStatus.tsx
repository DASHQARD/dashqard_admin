import { Button, CustomIcon, Modal, Text } from '@/components';
import { adminManagementMutations } from '@/features/hooks/adminManagement';
import { usePersistedModalState } from '@/hooks';
import { MODALS } from '@/utils/constants';

type AdminStatusData = {
  id: string | number;
  first_name?: string;
  last_name?: string;
  email?: string;
  status?: string;
  _statusAction?: 'active' | 'deactivated';
};

export function ToggleAdminStatus() {
  const modal = usePersistedModalState<AdminStatusData>({
    paramName: MODALS.ADMIN.PARAM_NAME,
  });

  const { useUpdateAdminStatus } = adminManagementMutations();
  const updateStatusMutation = useUpdateAdminStatus();

  const nextStatus =
    modal.modalData?._statusAction ||
    (String(modal.modalData?.status || '').toLowerCase() === 'active'
      ? 'deactivated'
      : 'active');
  const isActivating = nextStatus === 'active';
  const displayName =
    `${modal.modalData?.first_name || ''} ${modal.modalData?.last_name || ''}`.trim() ||
    modal.modalData?.email ||
    'this admin';

  const handleConfirm = () => {
    if (!modal.modalData?.id) return;

    updateStatusMutation.mutate(
      {
        id: String(modal.modalData.id),
        status: nextStatus,
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
      isOpen={modal.isModalOpen(MODALS.ADMIN.TOGGLE_STATUS)}
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
            name="InfoSign"
            width={48}
            height={48}
            className={isActivating ? 'text-green-500' : 'text-error'}
          />
          <div>
            <Text variant="h3" className="text-center font-semibold capitalize">
              {isActivating ? 'Activate Admin' : 'Deactivate Admin'}
            </Text>
            <p className="mt-4 mx-6 mb-12 text-[#5F6166] text-center">
              {isActivating
                ? `Are you sure you want to activate ${displayName}? They will be able to sign in again.`
                : `Are you sure you want to deactivate ${displayName}? They will be signed out and cannot log in until reactivated.`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={modal.closeModal}
            className="grow"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant={isActivating ? 'secondary' : 'danger'}
            className={
              isActivating ? 'bg-green-500! text-white! grow' : 'grow'
            }
            loading={updateStatusMutation.isPending}
            disabled={updateStatusMutation.isPending}
            onClick={handleConfirm}
          >
            {isActivating ? 'Activate' : 'Deactivate'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
