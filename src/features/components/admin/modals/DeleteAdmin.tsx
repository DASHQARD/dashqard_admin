import { Button, Modal, Text } from '@/components';
import { adminManagementMutations } from '@/features/hooks/adminManagement';
import { usePersistedModalState } from '@/hooks';
import { MODALS } from '@/utils/constants';

type AdminData = {
  id: string | number;
  first_name?: string;
  last_name?: string;
  email?: string;
};

export function DeleteAdmin() {
  const modal = usePersistedModalState<AdminData>({
    paramName: MODALS.ADMIN.PARAM_NAME,
  });

  const { useDeleteAdmin } = adminManagementMutations();
  const deleteMutation = useDeleteAdmin();

  const displayName =
    `${modal.modalData?.first_name || ''} ${modal.modalData?.last_name || ''}`.trim() ||
    modal.modalData?.email ||
    'this admin';

  const handleDelete = () => {
    if (!modal.modalData?.id) return;

    deleteMutation.mutate(String(modal.modalData.id), {
      onSuccess: () => {
        modal.closeModal();
      },
      onError: (err: { status?: number }) => {
        // Already deleted — close modal after list refresh in mutation
        if (err?.status === 404) {
          modal.closeModal();
        }
      },
    });
  };

  return (
    <Modal
      panelClass="!w-[500px]"
      title="Delete Admin"
      isOpen={modal.isModalOpen(MODALS.ADMIN.REMOVE)}
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
          <strong>{displayName}</strong>? This cannot be undone through the API.
          Prefer deactivation for temporary suspension.
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
            disabled={deleteMutation.isPending}
            loading={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
