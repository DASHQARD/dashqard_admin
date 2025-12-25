import type { SubmitHandler } from 'react-hook-form';

import { Button, CustomIcon, Modal, Text } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { MODALS } from '@/utils/constants';
import { vendorManagementMutations } from '@/features/hooks/vendorManagement';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCustomForm } from '@/libs';

type VendorData = {
  id: number;
  vendor_account_id?: number;
};

export function ApproveVendor() {
  const modal = usePersistedModalState<VendorData>({
    paramName: MODALS.VENDOR_MANAGEMENT.PARAM_NAME,
  });

  const { useApproveVendor } = vendorManagementMutations();
  const approveVendorMutation = useApproveVendor();

  const form = useCustomForm({
    resolver: zodResolver(
      z.object({
        vendor_account_id: z.number(),
      })
    ),
    defaultValues: {
      vendor_account_id:
        modal.modalData?.vendor_account_id || modal.modalData?.id,
    },
  });

  const onSubmit: SubmitHandler<{ vendor_account_id: number }> = (data) => {
    approveVendorMutation.mutate(
      {
        ...data,
        approval_status: 'approved',
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
      isOpen={modal.isModalOpen(MODALS.VENDOR_MANAGEMENT.CHILDREN.APPROVE)}
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
                Approve vendor
              </Text>
              <p className="text-gray-600 text-center text-sm">
                Are you sure you want to approve this vendor?
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
              loading={approveVendorMutation.isPending}
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
