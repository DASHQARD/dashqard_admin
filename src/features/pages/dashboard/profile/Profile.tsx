import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Input,
  Loader,
  Profile as ProfileComponent,
  Text,
} from '@/components';
import { useAdminService } from '@/features/hooks/useAdminService';
import { useToast } from '@/hooks';
import { useCustomForm } from '@/libs';
import { formatDate } from '@/utils';
import React from 'react';
import { z } from 'zod';
import { ChangePasswordForm } from './ChangePasswordForm';

const updateProfileSchema = z.object({
  first_name: z
    .string()
    .transform((val) => val.trim())
    .pipe(z.string().min(1, 'First name is required')),
  last_name: z
    .string()
    .transform((val) => val.trim())
    .pipe(z.string().min(1, 'Last name is required')),
  phone_number: z
    .string()
    .transform((val) => val.trim())
    .pipe(z.string().min(1, 'Phone number is required')),
});

type UpdateProfileSchemaType = z.infer<typeof updateProfileSchema>;

export default function Profile() {
  const toast = useToast();
  const { useAdminProfile, useUpdateAdminProfile } = useAdminService();
  const { data: adminProfile, isLoading } = useAdminProfile();
  const { mutate: updateAdminProfile, isPending: isUpdating } =
    useUpdateAdminProfile();

  const form = useCustomForm<UpdateProfileSchemaType>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      phone_number: '',
    },
  });

  // Reset when profile loads or server data changes — not when `form` changes (unstable
  // identity from useCustomForm would reset on every keystroke and block typing).
  React.useEffect(() => {
    if (!adminProfile) return;

    form.reset({
      first_name: adminProfile.first_name || '',
      last_name: adminProfile.last_name || '',
      phone_number: adminProfile.phone_number || '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    adminProfile?.id,
    adminProfile?.updated_at,
    adminProfile?.first_name,
    adminProfile?.last_name,
    adminProfile?.phone_number,
  ]);

  const adminInfo = React.useMemo(() => {
    if (!adminProfile) return [];

    return [
      {
        label: 'Admin ID',
        value: adminProfile.id || '-',
      },
      {
        label: 'Email',
        value: adminProfile.email || '-',
      },
      {
        label: 'First Name',
        value: adminProfile.first_name || '-',
      },
      {
        label: 'Last Name',
        value: adminProfile.last_name || '-',
      },
      {
        label: 'Phone Number',
        value: adminProfile.phone_number || '-',
      },
      {
        label: 'Role ID',
        value: adminProfile.role_id || '-',
      },
      {
        label: 'Type',
        value: adminProfile.type || '-',
      },
      {
        label: 'Date Joined',
        value: adminProfile.created_at
          ? formatDate(adminProfile.created_at)
          : '-',
      },
      {
        label: 'Last Updated',
        value: adminProfile.updated_at
          ? formatDate(adminProfile.updated_at)
          : '-',
      },
    ];
  }, [adminProfile]);

  if (isLoading) {
    return (
      <div className="lg:py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader />
        </div>
      </div>
    );
  }

  if (!adminProfile) {
    return (
      <div className="lg:py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <Text variant="p">No profile data found</Text>
        </div>
      </div>
    );
  }

  const fullName =
    `${adminProfile.first_name || ''} ${adminProfile.last_name || ''}`.trim() ||
    'Admin User';
  const roleName = adminProfile.role_id
    ? `Role ${adminProfile.role_id}`
    : 'No Role';

  const onSubmit = (values: UpdateProfileSchemaType) => {
    if (!adminProfile) return;

    const payload: Partial<UpdateProfileSchemaType> = {};

    if (values.first_name !== (adminProfile.first_name || '')) {
      payload.first_name = values.first_name;
    }
    if (values.last_name !== (adminProfile.last_name || '')) {
      payload.last_name = values.last_name;
    }
    if (values.phone_number !== (adminProfile.phone_number || '')) {
      payload.phone_number = values.phone_number;
    }

    if (Object.keys(payload).length === 0) {
      toast.info('No changes to update');
      return;
    }

    updateAdminProfile(payload);
  };

  return (
    <div className="lg:py-10">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <Text variant="h2" weight="semibold" className="text-primary-900">
            Profile
          </Text>
        </div>

        <ProfileComponent
          name={fullName}
          businessName={roleName}
          status={adminProfile.status || 'active'}
        >
          <div className="flex flex-col gap-8 w-full">
            <section className="w-full border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-5">
                <Text variant="h5" weight="medium">
                  Update Profile
                </Text>
                <Text variant="span" className="text-gray-400">
                  Email: {adminProfile.email || '-'}
                </Text>
              </div>

              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="First Name"
                    placeholder="Enter first name"
                    {...form.register('first_name')}
                    error={form.formState.errors.first_name?.message}
                  />
                  <Input
                    label="Last Name"
                    placeholder="Enter last name"
                    {...form.register('last_name')}
                    error={form.formState.errors.last_name?.message}
                  />
                </div>

                <Input
                  label="Phone Number"
                  placeholder="Enter phone number"
                  {...form.register('phone_number')}
                  error={form.formState.errors.phone_number?.message}
                />

                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="grow"
                    onClick={() => {
                      if (!adminProfile) return;
                      form.reset({
                        first_name: adminProfile.first_name || '',
                        last_name: adminProfile.last_name || '',
                        phone_number: adminProfile.phone_number || '',
                      });
                    }}
                  >
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    variant="secondary"
                    className="grow"
                    loading={isUpdating}
                    disabled={!form.formState.isDirty}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </section>

            <section className="w-full border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-5">
                <Text variant="h5" weight="medium">
                  Change Password
                </Text>
              </div>
              <ChangePasswordForm />
            </section>

            <Text variant="h5" weight="medium">
              Personal Information
            </Text>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {adminInfo.map((item) => (
                <div className="flex flex-col gap-1 min-w-0" key={item.label}>
                  <p className="text-xs text-gray-400 whitespace-nowrap">
                    {item.label}
                  </p>
                  <Text
                    variant="span"
                    className="wrap-break-word overflow-hidden"
                  >
                    {item.value}
                  </Text>
                </div>
              ))}
            </section>
          </div>
        </ProfileComponent>
      </div>
    </div>
  );
}
