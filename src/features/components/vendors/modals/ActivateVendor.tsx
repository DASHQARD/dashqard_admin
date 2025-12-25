import type { SubmitHandler } from 'react-hook-form';
import { useEffect } from 'react';

import { Button, CustomIcon, Modal, Text } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { MODALS } from '@/utils/constants';
import { vendorManagementMutations } from '@/features/hooks/vendorManagement';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCustomForm } from '@/libs';

type VendorData = {
  id?: number;
  vendor_account_id?: number;
  vendor_id?: number;
};

export function ActivateVendor() {
  const modal = usePersistedModalState<VendorData>({
    paramName: MODALS.VENDOR_MANAGEMENT.PARAM_NAME,
  });

  const { useUpdateVendorStatus } = vendorManagementMutations();
  const updateStatusMutation = useUpdateVendorStatus();

  const form = useCustomForm({
    resolver: zodResolver(
      z.object({
        vendor_account_id: z.number(),
      })
    ),
    defaultValues: {
      vendor_account_id: 0,
    },
  });

  useEffect(() => {
    if (modal.modalData) {
      // The vendor_account_id is the id field in the vendor account data
      const vendorAccountId =
        modal.modalData?.vendor_account_id || modal.modalData?.id || 0;
      form.reset({
        vendor_account_id: vendorAccountId,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal.modalData]);

  const onSubmit: SubmitHandler<{ vendor_account_id: number }> = (data) => {
    updateStatusMutation.mutate(
      {
        ...data,
        status: 'active',
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
      isOpen={modal.isModalOpen(MODALS.VENDOR_MANAGEMENT.CHILDREN.ACTIVATE)}
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
              name={'InfoSign'}
              width={48}
              height={48}
              className="text-error"
            />
            <div className="flex flex-col gap-1">
              <Text variant="h3" className="text-center font-semibold">
                Activate vendor
              </Text>
              <p className="text-gray-600 text-center text-sm">
                Are you sure you want to activate this vendor? Confirm action
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
            <Button
              variant="secondary"
              loading={updateStatusMutation.isPending}
              className="grow"
            >
              Activate
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
