import type { SubmitHandler } from 'react-hook-form';
import type { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import { Button, CustomIcon, Modal, Text } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { useCustomForm } from '@/libs';
import { MODALS, toggleCustomerStatusSchema } from '@/utils';
import { corporateManagementMutations } from '@/features/hooks/corporateManagement/corporateMutations';

type ToggleCustomerStatusSchemaType = z.infer<
  typeof toggleCustomerStatusSchema
>;

export function SuspendCorporate() {
  const modal = usePersistedModalState<{ id: string }>({
    paramName: MODALS.CORPORATE_MANAGEMENT.CHILDREN.DEACTIVATE,
  });
  const { useUpdateCorporateStatus } = corporateManagementMutations();
  const suspendMutation = useUpdateCorporateStatus();

  const form = useCustomForm({
    resolver: zodResolver(toggleCustomerStatusSchema),
    defaultValues: {
      status: 'suspend',
      reason: ' ',
    },
  });

  const onSubmit: SubmitHandler<ToggleCustomerStatusSchemaType> = (data) => {
    suspendMutation.mutate(
      {
        user_id: modal.modalData?.id || '',
        ...data,
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
      isOpen={modal.isModalOpen(
        MODALS.CORPORATE_MANAGEMENT.CHILDREN.DEACTIVATE
      )}
      setIsOpen={(isOpen) => {
        if (!isOpen) {
          modal.closeModal();
        }
      }}
      position="center"
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="p-6">
          <div className="space-y-4 flex flex-col items-center justify-center">
            <CustomIcon
              name={'InfoSign'}
              width={48}
              height={48}
              className="text-error"
            />
            <div>
              <Text
                variant="h3"
                className="text-center font-semibold capitalize"
              >
                Suspend Corporate
              </Text>
              <p className="mt-4 mx-6 mb-12 text-[#5F6166] text-center">
                Are you sure you want to suspend this corporate? Confirm action
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
            <Button loading={suspendMutation.isPending} className="grow">
              Suspend
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
