import { Button, CustomIcon, Modal, Text } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { MODALS } from '@/utils/constants';
import { permissionsManagementMutations } from '@/features/hooks/permissionsManagement';

type PermissionData = {
  id: number;
  permission: string;
  category: string;
  description: string;
};

export function DeletePermission() {
  const modal = usePersistedModalState<PermissionData>({
    paramName: MODALS.PERMISSIONS_MANAGEMENT.PARAM_NAME,
  });

  const { useDeletePermission } = permissionsManagementMutations();
  const deletePermissionMutation = useDeletePermission();

  const handleDelete = () => {
    if (!modal.modalData?.id) return;

    deletePermissionMutation.mutate(String(modal.modalData.id), {
      onSuccess: () => {
        modal.closeModal();
      },
    });
  };

  return (
    <Modal
      panelClass=" "
      isOpen={modal.isModalOpen(MODALS.PERMISSIONS_MANAGEMENT.CHILDREN.DELETE)}
      setIsOpen={(isOpen) => {
        if (!isOpen) {
          modal.closeModal();
        }
      }}
      position="center"
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
              Delete Permission
            </Text>
            <p className="text-gray-600 text-center text-sm">
              Are you sure you want to delete the permission{' '}
              <strong>{modal.modalData?.permission}</strong>? This action cannot
              be undone.
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
            variant="danger"
            loading={deletePermissionMutation.isPending}
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
