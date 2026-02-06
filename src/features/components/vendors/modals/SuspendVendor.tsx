import type { SubmitHandler } from 'react-hook-form';
import { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button, CustomIcon, Modal, Text } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { useCustomForm } from '@/libs/react-hook-form';
import { MODALS } from '@/utils';
import { vendorManagementMutations } from '@/features/hooks/vendorManagement/vendorMutations';

const schema = z.object({
  vendor_account_id: z.number(),
  rejection_reason: z.string().min(1, 'Rejection reason is required'),
});

type FormData = z.infer<typeof schema>;

export function SuspendVendor() {
  const modal = usePersistedModalState<{ vendor_account_id: number }>({
    paramName: MODALS.VENDOR_MANAGEMENT.CHILDREN.DEACTIVATE,
  });
  const { useUpdateVendorStatus } = vendorManagementMutations();
  const suspendMutation = useUpdateVendorStatus();

  const form = useCustomForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      vendor_account_id: 0,
      rejection_reason: '',
    },
  });

  useEffect(() => {
    if (modal.modalData) {
      form.reset({
        vendor_account_id: modal.modalData.vendor_account_id ?? 0,
        rejection_reason: '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal.modalData]);

  const onSubmit: SubmitHandler<FormData> = (data) => {
    suspendMutation.mutate(
      {
        vendor_account_id: data.vendor_account_id,
        approval_status: 'rejected',
        rejection_reason: data.rejection_reason.trim(),
      },
      {
        onSuccess: () => {
          modal.closeModal();
          form.reset();
        },
      }
    );
  };

  return (
    <Modal
      panelClass="!max-w-md"
      isOpen={modal.isModalOpen(MODALS.VENDOR_MANAGEMENT.CHILDREN.DEACTIVATE)}
      setIsOpen={(isOpen) => {
        if (!isOpen) {
          modal.closeModal();
          form.reset();
        }
      }}
      position="center"
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="p-6 flex flex-col gap-6">
          <div className="space-y-4 flex flex-col items-center justify-center">
            <CustomIcon
              name="InfoSign"
              width={48}
              height={48}
              className="text-error"
            />
            <div>
              <Text
                variant="h3"
                className="text-center font-semibold capitalize"
              >
                Suspend Vendor
              </Text>
              <p className="mt-4 mx-6 mb-4 text-[#5F6166] text-center">
                Are you sure you want to suspend this vendor? You must provide a
                reason below.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Rejection reason <span className="text-error">*</span>
            </label>
            <Controller
              name="rejection_reason"
              control={form.control}
              render={({ field }) => (
                <textarea
                  {...field}
                  placeholder="Enter reason for suspension..."
                  className="w-full min-h-[100px] px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-y"
                  rows={4}
                />
              )}
            />
            {form.formState.errors.rejection_reason?.message && (
              <Text variant="span" className="text-sm text-error">
                {form.formState.errors.rejection_reason.message}
              </Text>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                modal.closeModal();
                form.reset();
              }}
              className="grow"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="danger"
              loading={suspendMutation.isPending}
              className="grow"
            >
              Suspend
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
