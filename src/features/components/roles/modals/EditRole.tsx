import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Modal, Text } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { useCustomForm } from '@/libs';
import { MODALS } from '@/utils/constants';
import { rolesManagementMutations } from '@/features/hooks/rolesManagement';
import { permissionsManagementQueries } from '@/features/hooks/permissionsManagement';
import { rolesManagementQueries } from '@/features/hooks/rolesManagement';
import { z } from 'zod';
import { Controller } from 'react-hook-form';
import { useEffect } from 'react';
import { Checkbox } from '@/components';

const editRoleSchema = z.object({
  id: z.string(),
  role: z.string().min(1, 'Role name is required'),
  description: z.string().min(1, 'Description is required'),
  permissions: z
    .array(z.string())
    .min(1, 'At least one permission is required'),
});

type EditRoleSchemaType = z.infer<typeof editRoleSchema>;

type RoleData = {
  id: number | string;
  role: string;
  description: string;
  permissions?: string[] | Array<{ permission: string }>;
};

export function EditRole() {
  const modal = usePersistedModalState<RoleData>({
    paramName: MODALS.ROLES_MANAGEMENT.PARAM_NAME,
  });

  const { useUpdateRole } = rolesManagementMutations();
  const updateRoleMutation = useUpdateRole();
  const { useGetSingleRole } = rolesManagementQueries();
  const { data: roleData } = useGetSingleRole(
    String(modal.modalData?.id || '')
  );
  const { useGetAllPermissions } = permissionsManagementQueries();
  const { data: permissionsData } = useGetAllPermissions();
  const permissionsList = permissionsData || [];

  const role = roleData || modal.modalData;

  const form = useCustomForm({
    resolver: zodResolver(editRoleSchema),
    defaultValues: {
      id: '',
      role: '',
      description: '',
      permissions: [],
    },
  });

  useEffect(() => {
    if (role) {
      const rolePermissions = Array.isArray(role.permissions)
        ? role.permissions.map((p: any) =>
            typeof p === 'string' ? p : p.permission
          )
        : [];

      form.reset({
        id: String(role.id),
        role: role.role || '',
        description: role.description || '',
        permissions: rolePermissions,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const onSubmit: SubmitHandler<EditRoleSchemaType> = (data) => {
    updateRoleMutation.mutate(data, {
      onSuccess: () => {
        modal.closeModal();
        form.reset();
      },
    });
  };

  return (
    <Modal
      panelClass="!w-[680px]"
      title="Edit Role"
      isOpen={modal.isModalOpen(MODALS.ROLES_MANAGEMENT.CHILDREN.EDIT)}
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
            <div className="flex flex-col gap-6">
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
                <div className="border border-gray-200 rounded-lg p-4 max-h-94 overflow-y-auto space-y-2">
                  {permissionsList.map((permission: any) => (
                    <Controller
                      key={permission.id}
                      control={form.control}
                      name="permissions"
                      render={({ field }) => (
                        <Checkbox
                          label={`${permission.permission} - ${permission.description}`}
                          checked={
                            field.value?.includes(permission.permission) ||
                            false
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
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t pb-6">
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
              loading={updateRoleMutation.isPending}
              type="submit"
              className="grow"
            >
              Update Role
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
