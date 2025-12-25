import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Modal, Text } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { useCustomForm } from '@/libs';
import { MODALS } from '@/utils/constants';
import { rolesManagementMutations } from '@/features/hooks/rolesManagement';
import { permissionsManagementQueries } from '@/features/hooks/permissionsManagement';
import { z } from 'zod';
import { Controller } from 'react-hook-form';
import { Checkbox } from '@/components';

const createRoleSchema = z.object({
  role: z.string().min(1, 'Role name is required'),
  description: z.string().min(1, 'Description is required'),
  permissions: z
    .array(z.string())
    .min(1, 'At least one permission is required'),
});

type CreateRoleSchemaType = z.infer<typeof createRoleSchema>;

export function CreateRole() {
  const modal = usePersistedModalState({
    paramName: MODALS.ROLES_MANAGEMENT.PARAM_NAME,
  });

  const { useCreateRole } = rolesManagementMutations();
  const createRoleMutation = useCreateRole();
  const { useGetAllPermissions } = permissionsManagementQueries();
  const { data: permissionsData } = useGetAllPermissions();
  const permissionsList = permissionsData?.data || [];

  const form = useCustomForm({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      role: '',
      description: '',
      permissions: [],
    },
  });

  const onSubmit: SubmitHandler<CreateRoleSchemaType> = (data) => {
    createRoleMutation.mutate(data, {
      onSuccess: () => {
        modal.closeModal();
        form.reset();
      },
    });
  };

  return (
    <Modal
      panelClass="!w-[680px]"
      title="Create Role"
      isOpen={modal.isModalOpen(MODALS.ROLES_MANAGEMENT.CHILDREN.CREATE)}
      setIsOpen={(isOpen) => {
        if (!isOpen) {
          modal.closeModal();
          form.reset();
        }
      }}
      position="center"
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="p-6 flex flex-col gap-6 max-h-[80vh] overflow-y-auto">
          <Input
            label="Role Name"
            placeholder="e.g., Admin"
            {...form.register('role')}
            error={form.formState.errors.role?.message}
          />
          <Input
            label="Description"
            placeholder="e.g., Full access to all features"
            {...form.register('description')}
            error={form.formState.errors.description?.message}
          />

          <div className="space-y-2">
            <Text variant="p" weight="medium" className="text-sm">
              Permissions
            </Text>
            <div className="border border-gray-200 rounded-lg p-4 max-h-64 overflow-y-auto space-y-2">
              {permissionsList.map((permission: any) => (
                <Controller
                  key={permission.id}
                  control={form.control}
                  name="permissions"
                  render={({ field }) => (
                    <Checkbox
                      label={`${permission.permission} - ${permission.description}`}
                      checked={
                        field.value?.includes(permission.permission) || false
                      }
                      onChange={(e) => {
                        const currentPermissions = field.value || [];
                        if (e.target.checked) {
                          field.onChange([
                            ...currentPermissions,
                            permission.permission,
                          ]);
                        } else {
                          field.onChange(
                            currentPermissions.filter(
                              (p: string) => p !== permission.permission
                            )
                          );
                        }
                      }}
                    />
                  )}
                />
              ))}
            </div>
            {form.formState.errors.permissions && (
              <p className="text-error text-xs">
                {form.formState.errors.permissions.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={modal.closeModal}
              className="grow"
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              loading={createRoleMutation.isPending}
              type="submit"
              className="grow"
            >
              Create Role
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
