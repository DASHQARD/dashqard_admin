import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Modal } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { useCustomForm } from '@/libs';
import { MODALS } from '@/utils/constants';
import { countriesManagementMutations } from '@/features/hooks/countriesManagement';
import { z } from 'zod';

const createCountrySchema = z.object({
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
});

type CreateCountrySchemaType = z.infer<typeof createCountrySchema>;

export function CreateCountry() {
  const modal = usePersistedModalState({
    paramName: MODALS.COUNTRIES_MANAGEMENT.PARAM_NAME,
  });

  const { useCreateCountry } = countriesManagementMutations();
  const createCountryMutation = useCreateCountry();

  const form = useCustomForm({
    resolver: zodResolver(createCountrySchema),
    defaultValues: {
      code: '',
      iso_code: '',
      name: '',
      currency: '',
    },
  });

  const onSubmit: SubmitHandler<CreateCountrySchemaType> = (data) => {
    createCountryMutation.mutate(data, {
      onSuccess: () => {
        modal.closeModal();
        form.reset();
      },
    });
  };

  return (
    <Modal
      panelClass="!w-[680px]"
      title="Create Country"
      isOpen={modal.isModalOpen(MODALS.COUNTRIES_MANAGEMENT.CHILDREN.CREATE)}
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
          <Input
            label="Country Name"
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
              disabled={createCountryMutation.isPending}
            >
              {createCountryMutation.isPending
                ? 'Creating...'
                : 'Create Country'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
