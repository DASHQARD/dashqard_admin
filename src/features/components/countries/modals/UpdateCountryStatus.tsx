import { Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Combobox, Modal } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { useCustomForm } from '@/libs';
import { MODALS } from '@/utils/constants';
import { countriesManagementMutations } from '@/features/hooks/countriesManagement';
import { z } from 'zod';
import { useEffect } from 'react';

const updateStatusSchema = z.object({
  status: z.string().min(1, 'Status is required'),
});

type UpdateStatusSchemaType = z.infer<typeof updateStatusSchema>;

type CountryData = {
  id: number | string;
  code: string;
  iso_code: string;
  name: string;
  currency: string;
  status?: string;
};

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

export function UpdateCountryStatus() {
  const modal = usePersistedModalState<CountryData>({
    paramName: MODALS.COUNTRIES_MANAGEMENT.PARAM_NAME,
  });

  const { useUpdateCountryStatus } = countriesManagementMutations();
  const updateStatusMutation = useUpdateCountryStatus();

  const form = useCustomForm({
    resolver: zodResolver(updateStatusSchema),
    defaultValues: {
      status: 'active',
    },
  });

  useEffect(() => {
    if (modal.modalData) {
      form.reset({
        status: modal.modalData.status || 'active',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal.modalData]);

  const onSubmit: SubmitHandler<UpdateStatusSchemaType> = (data) => {
    if (!modal.modalData?.id) return;

    updateStatusMutation.mutate(
      {
        id: String(modal.modalData.id),
        data,
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
      title="Update Country Status"
      isOpen={modal.isModalOpen(
        MODALS.COUNTRIES_MANAGEMENT.CHILDREN.UPDATE_STATUS
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
