import { Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BasePhoneInput, Button, Input, Modal, Combobox } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { useCustomForm } from '@/libs';
import { MODALS } from '@/utils/constants';
import { superAdminInvitationsManagementMutations } from '@/features/hooks/superAdminInvitationsManagement';
import { countriesManagementQueries } from '@/features/hooks/countriesManagement';
import type { Country } from '@/types/countries';
import { z } from 'zod';
import React from 'react';

const createInvitationSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone_number: z.string().min(1, 'Phone number is required'),
  country_iso: z.string().min(1, 'Country is required'),
});

type CreateInvitationSchemaType = z.infer<typeof createInvitationSchema>;

export function CreateSuperAdminInvitation() {
  const modal = usePersistedModalState({
    paramName: MODALS.SUPER_ADMIN_INVITATIONS_MANAGEMENT.PARAM_NAME,
  });

  const { useCreateSuperAdminInvitation } =
    superAdminInvitationsManagementMutations();
  const createInvitationMutation = useCreateSuperAdminInvitation();

  const { useGetActiveCountries } = countriesManagementQueries();
  const { data: countriesData } = useGetActiveCountries();

  const form = useCustomForm({
    resolver: zodResolver(createInvitationSchema),
    defaultValues: {
      email: '',
      phone_number: '',
      country_iso: '',
    },
  });

  const countriesByIso = React.useMemo(() => {
    if (!countriesData || !Array.isArray(countriesData)) {
      return new Map<string, Country>();
    }
    return new Map(countriesData.map((country) => [country.iso_code, country]));
  }, [countriesData]);

  const countriesOptions = React.useMemo(() => {
    if (!countriesData || !Array.isArray(countriesData)) return [];
    return countriesData.map((country) => ({
      label: country.name,
      value: country.iso_code,
    }));
  }, [countriesData]);

  const selectedCountry = countriesByIso.get(form.watch('country_iso'));

  const onSubmit: SubmitHandler<CreateInvitationSchemaType> = (data) => {
    const country = countriesByIso.get(data.country_iso);
    if (!country) {
      form.setError('country_iso', {
        type: 'manual',
        message: 'Invalid country selection',
      });
      return;
    }

    createInvitationMutation.mutate(
      {
        email: data.email,
        phone_number: data.phone_number,
        country: country.name,
        country_code: country.code,
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

          <Controller
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <BasePhoneInput
                label="Phone Number"
                placeholder="Enter phone number"
                selectedVal={field.value}
                handleChange={field.onChange}
                error={form.formState.errors.phone_number?.message}
              />
            )}
          />

          <Controller
            control={form.control}
            name="country_iso"
            render={({ field }) => (
              <Combobox
                label="Country"
                placeholder="Select country"
                options={countriesOptions}
                value={field.value}
                onChange={(e: { target: { value: string } }) => {
                  field.onChange(e.target.value ?? '');
                }}
                error={form.formState.errors.country_iso?.message}
              />
            )}
          />

          <Input
            label="Internal Country Code"
            placeholder="Auto-filled from selection"
            value={selectedCountry?.code ?? ''}
            disabled
            readOnly
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
