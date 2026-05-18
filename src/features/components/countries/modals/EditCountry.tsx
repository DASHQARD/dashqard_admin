import { Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Combobox, Input, Modal } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { useCustomForm } from '@/libs';
import { MODALS } from '@/utils/constants';
import { countriesManagementMutations } from '@/features/hooks/countriesManagement';
import { z } from 'zod';
import { useEffect } from 'react';

const editCountrySchema = z.object({
  code: z
    .string()
    .min(1, 'Code is required')
    .max(10, 'Code must be 10 characters or less'),
  iso_code: z
    .string()
    .min(1, 'ISO code is required')
    .max(10, 'ISO code must be 10 characters or less'),
  name: z.string().min(1, 'Name is required'),
  currency: z
    .string()
    .min(1, 'Currency is required')
    .max(10, 'Currency must be 10 characters or less'),
  status: z.enum(['active', 'inactive'], {
    message: 'Status must be either active or inactive',
  }),
});

type EditCountrySchemaType = z.infer<typeof editCountrySchema>;

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

const normalizeStatus = (status?: string): EditCountrySchemaType['status'] => {
  return status === 'inactive' ? 'inactive' : 'active';
};

export function EditCountry() {
  const modal = usePersistedModalState<CountryData>({
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
                {...form.register('name')}
                error={form.formState.errors.name?.message}
              />

              <Input
                label="Code"
                placeholder="Enter country code"
                {...form.register('code')}
                error={form.formState.errors.code?.message}
              />

              <Input
                label="ISO Code"
                placeholder="Enter ISO code"
                {...form.register('iso_code')}
                error={form.formState.errors.iso_code?.message}
              />

              <Input
                label="Currency"
                placeholder="Enter currency code"
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
