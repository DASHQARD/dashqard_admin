import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Combobox, Modal } from '@/components';
import { Controller } from 'react-hook-form';
import { usePersistedModalState } from '@/hooks';
import { useCustomForm } from '@/libs';
import { MODALS } from '@/utils/constants';
import { paymentsManagementMutations } from '@/features/hooks/paymentsManagement';
import { z } from 'zod';
import { useEffect } from 'react';

const updatePaymentStatusSchema = z.object({
  status: z.string().min(1, 'Status is required'),
});

type UpdatePaymentStatusSchemaType = z.infer<typeof updatePaymentStatusSchema>;

type PaymentData = {
  id: number | string;
  trans_id?: string;
  receipt_number?: string;
  status?: string;
};

export function UpdatePaymentStatus() {
  const modal = usePersistedModalState<PaymentData>({
    paramName: MODALS.PAYMENTS_MANAGEMENT.PARAM_NAME,
  });

  const { useUpdatePaymentStatus } = paymentsManagementMutations();
  const updatePaymentStatusMutation = useUpdatePaymentStatus();

  const form = useCustomForm({
    resolver: zodResolver(updatePaymentStatusSchema),
    defaultValues: {
      status: '',
    },
  });

  const isUpdateModalOpen =
    modal.modalState === MODALS.PAYMENTS_MANAGEMENT.CHILDREN.UPDATE_STATUS;

  // Reset when this modal opens or row data changes. Do not put `form` in deps —
  // useCustomForm returns a new object every render, which retriggers the effect
  // and causes "Maximum update depth exceeded" with form.reset().
  useEffect(() => {
    if (!isUpdateModalOpen || !modal.modalData) return;

    form.reset({
      status: modal.modalData.status || '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- see comment above
  }, [isUpdateModalOpen, modal.modalData?.id, modal.modalData?.status]);

  const onSubmit: SubmitHandler<UpdatePaymentStatusSchemaType> = (data) => {
    if (!modal.modalData?.id) return;

    updatePaymentStatusMutation.mutate(
      {
        id: String(modal.modalData.id),
        data: { status: data.status },
      },
      {
        onSuccess: () => {
          modal.closeModal();
          form.reset();
        },
      }
    );
  };

  // {
  //   "status": "error",
  //     "statusCode": 422,
  //       "message": "\"status\" must be one of [pending, completed, failed, refunded]",
  //         "url": "/api/v1/payments/271/status"
  // }

  const statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Completed', value: 'completed' },
    { label: 'Failed', value: 'failed' },
    { label: 'Refunded', value: 'refunded' },
  ];

  return (
    <Modal
      panelClass="!w-[680px]"
      title="Update Payment Status"
      isOpen={modal.isModalOpen(
        MODALS.PAYMENTS_MANAGEMENT.CHILDREN.UPDATE_STATUS
      )}
      setIsOpen={(isOpen) => {
        if (!isOpen) {
          modal.closeModal();
          form.reset();
        }
      }}
      position="side"
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col h-full"
      >
        <div className="h-full px-6 flex flex-col gap-6 justify-between">
          <div className="grow overflow-y-auto py-6">
            <div className="space-y-6">
              <Controller
                control={form.control}
                name="status"
                render={({ field }) => (
                  <Combobox
                    label="Status"
                    placeholder="Select status"
                    options={statusOptions}
                    value={field.value}
                    onChange={(e: { target: { value: string } }) => {
                      field.onChange(e.target.value);
                    }}
                    error={form.formState.errors.status?.message}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex gap-4 justify-end pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                modal.closeModal();
                form.reset();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="secondary"
              disabled={updatePaymentStatusMutation.isPending}
            >
              {updatePaymentStatusMutation.isPending
                ? 'Updating...'
                : 'Update Status'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
