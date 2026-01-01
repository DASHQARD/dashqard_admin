import { Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Combobox, Modal } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { useCustomForm } from '@/libs';
import { MODALS } from '@/utils/constants';
import { superAdminInvitationsManagementMutations } from '@/features/hooks/superAdminInvitationsManagement';
import { z } from 'zod';
import { useEffect } from 'react';

const updateStatusSchema = z.object({
  status: z.string().min(1, 'Status is required'),
  id: z.string().optional(),
});

type UpdateStatusSchemaType = z.infer<typeof updateStatusSchema>;

type InvitationData = {
  id: number | string;
  email?: string;
  phone_number?: string;
  country?: string;
  country_code?: string;
  status?: string;
};

const statusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Expired', value: 'expired' },
];

export function UpdateSuperAdminInvitationStatus() {
  const modal = usePersistedModalState<InvitationData>({
    paramName: MODALS.SUPER_ADMIN_INVITATIONS_MANAGEMENT.PARAM_NAME,
  });

  const { useUpdateSuperAdminInvitationStatus } =
    superAdminInvitationsManagementMutations();
  const updateStatusMutation = useUpdateSuperAdminInvitationStatus();

  const form = useCustomForm({
    resolver: zodResolver(updateStatusSchema),
    defaultValues: {
      status: 'pending',
      id: '',
    },
  });

  useEffect(() => {
    if (modal.modalData) {
      form.reset({
        status: modal.modalData.status || 'pending',
        id: String(modal.modalData.id),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal.modalData]);

  const onSubmit: SubmitHandler<UpdateStatusSchemaType> = (data) => {
    if (!modal.modalData?.id) return;

    updateStatusMutation.mutate(
      {
        id: String(modal.modalData.id),
        status: data.status,
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
      panelClass="!w-[500px]"
      title="Update Corporate Invitation Status"
      isOpen={modal.isModalOpen(
        MODALS.SUPER_ADMIN_INVITATIONS_MANAGEMENT.CHILDREN.UPDATE_STATUS
      )}
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

          <div className="flex gap-4 justify-end pt-4">
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
              disabled={updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending ? 'Updating...' : 'Update Status'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

