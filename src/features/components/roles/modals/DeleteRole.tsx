import { Button, CustomIcon, Modal, Text } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { MODALS } from '@/utils/constants';
import { rolesManagementMutations } from '@/features/hooks/rolesManagement';

type RoleData = {
  id: number;
  role: string;
  description: string;
};

export function DeleteRole() {
  const modal = usePersistedModalState<RoleData>({
    paramName: MODALS.ROLES_MANAGEMENT.PARAM_NAME,
  });

  const { useDeleteRole } = rolesManagementMutations();
  const deleteRoleMutation = useDeleteRole();

  const handleDelete = () => {
    if (!modal.modalData?.id) return;

    deleteRoleMutation.mutate(String(modal.modalData.id), {
      onSuccess: () => {
        modal.closeModal();
      },
    });
  };

  return (
    <Modal
      panelClass=" "
      isOpen={modal.isModalOpen(MODALS.ROLES_MANAGEMENT.CHILDREN.DELETE)}
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
              Delete Role
            </Text>
            <p className="text-gray-600 text-center text-sm">
              Are you sure you want to delete the role{' '}
              <strong>{modal.modalData?.role}</strong>? This action cannot be
              undone.
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
            loading={deleteRoleMutation.isPending}
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
