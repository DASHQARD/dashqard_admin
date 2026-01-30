import type { SubmitHandler } from 'react-hook-form';
import { useEffect } from 'react';

import { Button, CustomIcon, Modal, Text } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { MODALS } from '@/utils/constants';
import { vendorManagementMutations } from '@/features/hooks/vendorManagement';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCustomForm } from '@/libs';
import { Controller } from 'react-hook-form';

type VendorData = {
  id?: number;
  vendor_account_id?: number;
  vendor_id?: number;
};

const schema = z.object({
  vendor_account_id: z.number(),
  rejection_reason: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function DeactivateVendor() {
  const modal = usePersistedModalState<VendorData>({
    paramName: MODALS.VENDOR_MANAGEMENT.PARAM_NAME,
  });

  const { useRejectVendor } = vendorManagementMutations();
  const rejectVendorMutation = useRejectVendor();

  const form = useCustomForm({
    resolver: zodResolver(schema),
    defaultValues: {
      vendor_account_id: 0,
      rejection_reason: '',
    },
  });

  useEffect(() => {
    if (modal.modalData) {
      const vendorAccountId =
        modal.modalData?.vendor_account_id || modal.modalData?.id || 0;
      form.reset({
        vendor_account_id: vendorAccountId,
        rejection_reason: '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal.modalData]);

  const onSubmit: SubmitHandler<FormData> = (data) => {
    rejectVendorMutation.mutate(
      {
        vendor_account_id: data.vendor_account_id,
        ...(data.rejection_reason?.trim() && {
          rejection_reason: data.rejection_reason.trim(),
        }),
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
      isOpen={modal.isModalOpen(MODALS.VENDOR_MANAGEMENT.CHILDREN.DEACTIVATE)}
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
                Reject vendor
              </Text>
              <p className="text-gray-600 text-center text-sm">
                Are you sure you want to reject this vendor? You may provide a
                reason below.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Rejection reason (optional)
            </label>
            <Controller
              name="rejection_reason"
              control={form.control}
              render={({ field }) => (
                <textarea
                  {...field}
                  placeholder="Enter reason for rejection..."
                  className="w-full min-h-[80px] px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                />
              )}
            />
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
              type="submit"
              variant="danger"
              loading={rejectVendorMutation.isPending}
              className="grow"
            >
              Reject
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
