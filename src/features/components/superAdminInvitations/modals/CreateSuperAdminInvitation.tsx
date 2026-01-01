import { Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Modal, Combobox } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { useCustomForm } from '@/libs';
import { MODALS } from '@/utils/constants';
import { superAdminInvitationsManagementMutations } from '@/features/hooks/superAdminInvitationsManagement';
import { countriesManagementQueries } from '@/features/hooks/countriesManagement';
import { z } from 'zod';
import React from 'react';

const createInvitationSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone_number: z.string().min(1, 'Phone number is required'),
  country: z.string().min(1, 'Country is required'),
  country_code: z.string().min(1, 'Country code is required'),
});

type CreateInvitationSchemaType = z.infer<typeof createInvitationSchema>;

export function CreateSuperAdminInvitation() {
  const modal = usePersistedModalState({
    paramName: MODALS.SUPER_ADMIN_INVITATIONS_MANAGEMENT.PARAM_NAME,
  });

  const { useCreateSuperAdminInvitation } =
    superAdminInvitationsManagementMutations();
  const createInvitationMutation = useCreateSuperAdminInvitation();

  const { useGetCountries } = countriesManagementQueries();
  const { data: countriesData } = useGetCountries();

  const form = useCustomForm({
    resolver: zodResolver(createInvitationSchema),
    defaultValues: {
      email: '',
      phone_number: '',
      country: '',
      country_code: '',
    },
  });

  const countriesOptions = React.useMemo(() => {
    if (!countriesData || !Array.isArray(countriesData)) return [];
    return countriesData.map((country: any) => ({
      label: country.name || '',
      value: country.name || '',
      code: country.code || '',
    }));
  }, [countriesData]);


  const onSubmit: SubmitHandler<CreateInvitationSchemaType> = (data) => {
    createInvitationMutation.mutate(data, {
      onSuccess: () => {
        modal.closeModal();
        form.reset();
      },
    });
  };

  return (
    <Modal
      panelClass="!w-[680px]"
      title="Invite Corporate Account to Dashboard"
      isOpen={modal.isModalOpen(
        MODALS.SUPER_ADMIN_INVITATIONS_MANAGEMENT.CHILDREN.CREATE
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
          <Input
            label="Email"
            type="email"
            placeholder="Enter email address"
            {...form.register('email')}
            error={form.formState.errors.email?.message}
          />

          <Input
            label="Phone Number"
            placeholder="Enter phone number"
            {...form.register('phone_number')}
            error={form.formState.errors.phone_number?.message}
          />

          <Controller
            control={form.control}
            name="country"
            render={({ field }) => (
              <Combobox
                label="Country"
                placeholder="Select country"
                options={countriesOptions}
                value={field.value}
                onChange={(e: { target: { value: string } }) => {
                  const countryName = e.target.value;
                  field.onChange(countryName);
                  const selectedCountry = countriesData?.find(
                    (c: any) => c.name === countryName
                  );
                  form.setValue('country_code', selectedCountry?.code || '');
                }}
                error={form.formState.errors.country?.message}
              />
            )}
          />

          <Input
            label="Country Code"
            placeholder="Country code (auto-filled)"
            {...form.register('country_code')}
            error={form.formState.errors.country_code?.message}
            disabled
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
              disabled={createInvitationMutation.isPending}
            >
              {createInvitationMutation.isPending
                ? 'Sending Invitation...'
                : 'Send Invitation'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

