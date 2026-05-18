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
  role: z
    .string()
    .transform((s) => s.trim())
    .pipe(
      z
        .string()
        .min(1, 'Role name is required')
        .max(200, 'Role name must be at most 200 characters')
    ),
  description: z
    .string()
    .transform((s) => s.trim())
    .pipe(
      z
        .string()
        .min(1, 'Description is required')
        .max(2000, 'Description must be at most 2000 characters')
    ),
  permissions: z
    .array(
      z
        .string()
        .transform((s) => s.trim())
        .pipe(z.string().min(1, 'Invalid permission'))
    )
    .min(1, 'Select at least one permission'),
});

type CreateRoleSchemaType = z.infer<typeof createRoleSchema>;

export function CreateRole() {
  const modal = usePersistedModalState({
    paramName: MODALS.ROLES_MANAGEMENT.PARAM_NAME,
  });

  const { useCreateRole } = rolesManagementMutations();
  const createRoleMutation = useCreateRole();
  const { useGetAllPermissionsList } = permissionsManagementQueries();
  const { data: permissionsList = [] } = useGetAllPermissionsList();

  const form = useCustomForm({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      role: '',
      description: '',
      permissions: [],
    },
  });

  const onSubmit: SubmitHandler<CreateRoleSchemaType> = (data) => {
    createRoleMutation.mutate(data as any, {
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
      position="side"
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col h-full"
      >
        <div className="p-6 flex flex-col gap-6 flex-1 overflow-y-auto">
          <Input
            label="Role Name"
            placeholder="e.g., Admin"
            {...form.register('role')}
            error={form.formState.errors.role?.message}
          />
          <Input
            label="Description"
            type="textarea"
            rows={4}
            innerClassName="h-24"
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
                      checked={field.value?.includes(permission.id) || false}
                      onChange={(e) => {
                        const currentPermissions = field.value || [];
                        if (e.target.checked) {
                          field.onChange([
                            ...currentPermissions,
                            permission.id,
                          ]);
                        } else {
                          field.onChange(
                            currentPermissions.filter(
                              (p: string) => p !== permission.id
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
        </div>

        <div className="flex items-center gap-3 pt-4 px-6 pb-6 border-t border-gray-200 shrink-0">
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
      </form>
    </Modal>
  );
}
