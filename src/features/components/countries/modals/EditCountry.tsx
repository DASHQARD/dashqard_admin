import { Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Combobox, Input, Modal } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { useCustomForm } from '@/libs';
import { MODALS } from '@/utils/constants';
import { countriesManagementMutations } from '@/features/hooks/countriesManagement';
import type { Country, CountryStatus } from '@/types/countries';
import { z } from 'zod';
import { useEffect } from 'react';

const editCountrySchema = z.object({
  code: z
    .string()
    .trim()
    .length(2, 'Internal code must be exactly 2 characters'),
  iso_code: z
    .string()
    .trim()
    .length(2, 'ISO code must be exactly 2 characters'),
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be 100 characters or less'),
  currency: z
    .string()
    .trim()
    .length(3, 'Currency must be exactly 3 characters'),
  status: z.enum(['active', 'inactive'], {
    message: 'Status must be either active or inactive',
  }),
});

type EditCountrySchemaType = z.infer<typeof editCountrySchema>;

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

const normalizeStatus = (status?: string): CountryStatus => {
  return status === 'inactive' ? 'inactive' : 'active';
};

export function EditCountry() {
  const modal = usePersistedModalState<Country>({
    paramName: MODALS.COUNTRIES_MANAGEMENT.PARAM_NAME,
  });

  const { useUpdateCountry } = countriesManagementMutations();
  const updateCountryMutation = useUpdateCountry();

  const form = useCustomForm<EditCountrySchemaType>({
    resolver: zodResolver(editCountrySchema),
    defaultValues: {
      code: '',
      iso_code: '',
      name: '',
      currency: '',
      status: normalizeStatus(),
    },
  });

  useEffect(() => {
    if (modal.modalData) {
      form.reset({
        code: modal.modalData.code || '',
        iso_code: modal.modalData.iso_code || '',
        name: modal.modalData.name || '',
        currency: modal.modalData.currency || '',
        status: normalizeStatus(modal.modalData.status),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal.modalData]);

  const onSubmit: SubmitHandler<EditCountrySchemaType> = (data) => {
    if (!modal.modalData?.id) return;

    updateCountryMutation.mutate(
      {
        id: String(modal.modalData.id),
        data: {
          code: data.code.trim(),
          iso_code: data.iso_code.trim().toUpperCase(),
          name: data.name.trim(),
          currency: data.currency.trim().toUpperCase(),
          status: data.status,
        },
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
      panelClass="!w-[680px]"
      title="Edit Country"
      isOpen={modal.isModalOpen(MODALS.COUNTRIES_MANAGEMENT.CHILDREN.EDIT)}
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
        className="h-full flex flex-col"
      >
        <div className="h-full px-6 flex flex-col gap-6 justify-between">
          <div className="grow overflow-y-auto py-6">
            <div className="grid grid-cols-2 gap-6">
              <Input
                label="Country Name"
                className="col-span-full"
                placeholder="Enter country name"
                maxLength={100}
                {...form.register('name')}
                error={form.formState.errors.name?.message}
              />

              <Input
                label="Internal code"
                placeholder="e.g. 01"
                maxLength={2}
                {...form.register('code')}
                error={form.formState.errors.code?.message}
              />

              <Input
                label="ISO Code"
                placeholder="e.g. GH"
                maxLength={2}
                {...form.register('iso_code')}
                error={form.formState.errors.iso_code?.message}
              />

              <Input
                label="Currency"
                placeholder="e.g. GHS"
                maxLength={3}
                {...form.register('currency')}
                error={form.formState.errors.currency?.message}
              />

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

          <div className="flex items-center gap-3 pt-4 border-t border-gray-200 pb-6">
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
              variant="secondary"
              loading={updateCountryMutation.isPending}
              type="submit"
              className="grow"
            >
              Update Country
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
