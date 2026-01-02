import { Button, Modal, Text } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { MODALS } from '@/utils/constants';
import { superAdminInvitationsManagementMutations } from '@/features/hooks/superAdminInvitationsManagement';

type InvitationData = {
  id: number | string;
  email?: string;
  phone_number?: string;
  country?: string;
  country_code?: string;
  status?: string;
};

export function DeleteSuperAdminInvitation() {
  const modal = usePersistedModalState<InvitationData>({
    paramName: MODALS.SUPER_ADMIN_INVITATIONS_MANAGEMENT.PARAM_NAME,
  });

  const { useDeleteSuperAdminInvitation } =
    superAdminInvitationsManagementMutations();
  const deleteInvitationMutation = useDeleteSuperAdminInvitation();

  const handleDelete = () => {
    if (!modal.modalData?.id) return;

    deleteInvitationMutation.mutate(String(modal.modalData.id), {
      onSuccess: () => {
        modal.closeModal();
      },
    });
  };

  return (
    <Modal
      panelClass="!w-[500px]"
      title="Delete Corporate Invitation"
      isOpen={modal.isModalOpen(
        MODALS.SUPER_ADMIN_INVITATIONS_MANAGEMENT.CHILDREN.DELETE
      )}
      setIsOpen={(isOpen) => {
        if (!isOpen) {
          modal.closeModal();
        }
      }}
      position="center"
    >
      <div className="p-6 flex flex-col gap-6">
        <Text variant="h3" className="font-semibold">
          Are you sure you want to <span className="text-red-500">delete</span>{' '}
          the corporate onboarding invitation for{' '}
          <strong>
            {modal.modalData?.email ||
              modal.modalData?.phone_number ||
              'this invitation'}
          </strong>
          ? This action cannot be undone.
        </Text>

        <div className="flex gap-4 justify-end pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => modal.closeModal()}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            disabled={deleteInvitationMutation.isPending}
          >
            {deleteInvitationMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
