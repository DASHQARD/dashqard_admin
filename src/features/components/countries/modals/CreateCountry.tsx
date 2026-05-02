import { Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { Button, Combobox, Modal } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { useCustomForm } from '@/libs';
import { MODALS } from '@/utils/constants';
import { countriesManagementMutations } from '@/features/hooks/countriesManagement';
import { getCountryCreateFormOptions } from '@/utils/helpers/countryCreateFormOptions';
import { z } from 'zod';

const createCountrySchema = z.object({
  country_iso: z.string().min(1, 'Please select a country'),
});

type CreateCountrySchemaType = z.infer<typeof createCountrySchema>;

export function CreateCountry() {
  const modal = usePersistedModalState({
    paramName: MODALS.COUNTRIES_MANAGEMENT.PARAM_NAME,
  });

  const { useCreateCountry } = countriesManagementMutations();
  const createCountryMutation = useCreateCountry();

  const { countryOptions, countryPayloadByIso } = useMemo(() => {
    const options = getCountryCreateFormOptions();
    return {
      countryOptions: options,
      countryPayloadByIso: new Map(
        options.map((o) => [o.value, o.meta] as const)
      ),
    };
  }, []);

  const form = useCustomForm({
    resolver: zodResolver(createCountrySchema),
    defaultValues: {
      country_iso: '',
    },
  });

  const onSubmit: SubmitHandler<CreateCountrySchemaType> = (data) => {
    const payload = countryPayloadByIso.get(data.country_iso);
    if (!payload) {
      form.setError('country_iso', {
        type: 'manual',
        message: 'Invalid country selection',
      });
      return;
    }

    createCountryMutation.mutate(payload, {
      onSuccess: () => {
        modal.closeModal();
        form.reset();
      },
    });
  };

  return (
    <Modal
      panelClass="!w-[520px]"
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
          <Controller
            control={form.control}
            name="country_iso"
            render={({ field }) => (
              <Combobox
                label="Country"
                placeholder="Select country"
                options={countryOptions}
                value={field.value}
                onChange={(e: { target: { value: string } }) => {
                  field.onChange(e.target.value ?? '');
                }}
                error={form.formState.errors.country_iso?.message}
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
