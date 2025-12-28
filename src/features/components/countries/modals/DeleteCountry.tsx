import { Button, Modal, Text } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { MODALS } from '@/utils/constants';
import { countriesManagementMutations } from '@/features/hooks/countriesManagement';

type CountryData = {
  id: number | string;
  code: string;
  iso_code: string;
  name: string;
  currency: string;
  status?: string;
};

export function DeleteCountry() {
  const modal = usePersistedModalState<CountryData>({
    paramName: MODALS.COUNTRIES_MANAGEMENT.PARAM_NAME,
  });

  const { useDeleteCountry } = countriesManagementMutations();
  const deleteCountryMutation = useDeleteCountry();

  const handleDelete = () => {
    if (!modal.modalData?.id) return;

    deleteCountryMutation.mutate(String(modal.modalData.id), {
      onSuccess: () => {
        modal.closeModal();
      },
    });
  };

  return (
    <Modal
      panelClass="!w-[500px]"
      title="Delete Country"
      isOpen={modal.isModalOpen(MODALS.COUNTRIES_MANAGEMENT.CHILDREN.DELETE)}
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
          {modal.modalData?.name || 'this country'}? This action cannot be
          undone.
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
            disabled={deleteCountryMutation.isPending}
          >
            {deleteCountryMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
