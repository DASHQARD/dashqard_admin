import type { SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Text, Combobox } from '@/components';
import { useCustomForm } from '@/libs';
import { z } from 'zod';
import { useInviteAdmin } from '@/features/hooks';
import { rolesManagementQueries } from '@/features/hooks/rolesManagement';
import { ROUTES } from '@/utils/constants';
import { Controller } from 'react-hook-form';
import React from 'react';

const inviteAdminSchema = z.object({
  email: z.string().email('Invalid email address'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  phone_number: z.string().min(1, 'Phone number is required'),
  role_id: z.string().min(1, 'Role is required'),
  type: z.string().min(1, 'Admin type is required'),
});

type InviteAdminSchemaType = z.infer<typeof inviteAdminSchema>;

const adminTypes = [
  { label: 'Super Admin', value: 'super_admin' },
  { label: 'Admin', value: 'admin' },
];

export default function InviteAdmin() {
  const navigate = useNavigate();
  const { mutate: inviteAdmin, isPending } = useInviteAdmin();
  const { useGetAllRoles } = rolesManagementQueries();
  const { data: rolesData, isLoading: isLoadingRoles } = useGetAllRoles();
  const rolesList = rolesData || [];

  const form = useCustomForm({
    resolver: zodResolver(inviteAdminSchema),
    defaultValues: {
      email: '',
      first_name: '',
      last_name: '',
      phone_number: '',
      role_id: '',
      type: '',
    },
  });

  const rolesOptions = React.useMemo(() => {
    return rolesList.map((role: any) => ({
      label: role.role || role.name || '',
      value: String(role.id),
    }));
  }, [rolesList]);

  const onSubmit: SubmitHandler<InviteAdminSchemaType> = (data) => {
    inviteAdmin(
      {
        ...data,
        role_id: data.role_id,
        type: data.type,
      },
      {
        onSuccess: () => {
          navigate(ROUTES.IN_APP.ADMIN.ADMINS);
        },
      }
    );
  };

  return (
    <div className="lg:py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <Text variant="h2" weight="semibold" className="text-primary-900">
              Invite Admin
            </Text>
            <Button
              variant="outline"
              onClick={() => navigate(ROUTES.IN_APP.ADMIN.ADMINS)}
            >
              Cancel
            </Button>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                name="role_id"
                render={({ field }) => (
                  <Combobox
                    label="Role"
                    placeholder="Select role"
                    options={rolesOptions}
                    value={field.value}
                    onChange={(e: { target: { value: string } }) => {
                      field.onChange(e.target.value);
                    }}
                    isLoading={isLoadingRoles}
                    error={form.formState.errors.role_id?.message}
                  />
                )}
              />

              <Controller
                control={form.control}
                name="type"
                render={({ field }) => (
                  <Combobox
                    label="Admin Type"
                    placeholder="Select admin type"
                    options={adminTypes}
                    value={field.value}
                    onChange={(e: { target: { value: string } }) => {
                      field.onChange(e.target.value);
                    }}
                    error={form.formState.errors.type?.message}
                  />
                )}
              />

              <div className="flex items-center gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(ROUTES.IN_APP.ADMIN.ADMINS)}
                  className="grow"
                >
                  Cancel
                </Button>
                <Button
                  variant="secondary"
                  loading={isPending}
                  type="submit"
                  className="grow"
                >
                  Invite Admin
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

