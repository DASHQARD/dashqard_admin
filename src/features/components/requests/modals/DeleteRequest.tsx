import { Button, CustomIcon, Modal, Text } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { MODALS } from '@/utils/constants';
import { requestManagementMutations } from '@/features/hooks/requestManagement /requestsMutations';

type RequestData = {
  id: number | string;
  request_id?: string;
  name?: string;
};

export function DeleteRequest() {
  const modal = usePersistedModalState<RequestData>({
    paramName: MODALS.REQUEST_CORPORATE_MANAGEMENT.PARAM_NAME,
  });

  const { useDeleteRequest } = requestManagementMutations();
  const deleteRequestMutation = useDeleteRequest();

  const handleDelete = () => {
    if (!modal.modalData?.id) return;

    deleteRequestMutation.mutate(String(modal.modalData.id), {
      onSuccess: () => {
        modal.closeModal();
      },
    });
  };

  return (
    <Modal
      panelClass=" "
      isOpen={modal.isModalOpen(MODALS.REQUEST_CORPORATE_MANAGEMENT.CHILDREN.DELETE)}
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
              Delete Request
            </Text>
            <p className="text-gray-600 text-center text-sm">
              Are you sure you want to delete the request{' '}
              <strong>{modal.modalData?.request_id || modal.modalData?.name || 'this request'}</strong>? This action cannot be undone.
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
            loading={deleteRequestMutation.isPending}
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

