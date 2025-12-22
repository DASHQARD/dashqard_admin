import type { SubmitHandler } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { Button, CustomIcon, Modal, Text } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { useCustomForm } from '@/libs';
import type { ToggleSavingsStatusSchemaType } from '@/types';
import { MODALS } from '@/utils/constants';
import { toggleSavingsStatusSchema } from '@/utils/schemas/shared';
import { requestManagementMutations } from '@/features/hooks/requestManagement /requestsMutations';

export function ApproveRequestStatus() {
  const modal = usePersistedModalState<{
    id: string;
    status: string;
  }>({
    paramName: MODALS.REQUEST_CORPORATE_MANAGEMENT.PARAM_NAME,
  });

  const { useUpdateRequestStatus } = requestManagementMutations();
  const updateRequestStatusMutation = useUpdateRequestStatus();

  const form = useCustomForm({
    resolver: zodResolver(toggleSavingsStatusSchema),
    defaultValues: {
      id: String(modal.modalData?.id || ''),
      status: 'approved',
    },
  });

  const onSubmit: SubmitHandler<ToggleSavingsStatusSchemaType> = (data) => {
    updateRequestStatusMutation.mutate(data, {
      onSuccess: () => {
        modal.closeModal();
      },
    });
  };

  return (
    <Modal
      panelClass=" "
      isOpen={modal.isModalOpen(
        MODALS.REQUEST_CORPORATE_MANAGEMENT.CHILDREN.APPROVE
      )}
      setIsOpen={(isOpen) => {
        if (!isOpen) {
          modal.closeModal();
        }
      }}
      position="center"
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
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
                Approve request
              </Text>
              <p className="text-gray-600 text-center text-sm">
                Are you sure you want to approve the request?
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
              loading={updateRequestStatusMutation.isPending}
              className="grow"
            >
              Approve
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
