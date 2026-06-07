import { useEffect, useMemo } from 'react';
import { Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button, Combobox, Modal, Text } from '@/components';
import { rolesManagementMutations } from '@/features/hooks/rolesManagement';
import { rolesManagementQueries } from '@/features/hooks/rolesManagement';
import { useContentGuard, usePersistedModalState } from '@/hooks';
import { useCustomForm } from '@/libs';
import { MODALS } from '@/utils/constants';
import { canAssignAdminRole } from '@/utils/helpers/role';

const assignAdminRoleSchema = z.object({
  role_id: z.string().min(1, 'Select a role'),
});

type AssignAdminRoleSchemaType = z.infer<typeof assignAdminRoleSchema>;

type AdminData = {
  id: string | number;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  email?: string;
  role_id?: string | number | null;
  role_name?: string | null;
};

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function getAdminDisplayName(admin: AdminData | null | undefined): string {
  if (!admin) return 'Admin';
  return (
    admin.full_name ||
    `${admin.first_name ?? ''} ${admin.last_name ?? ''}`.trim() ||
    admin.email ||
    'Admin'
  );
}

export function AssignAdminRole() {
  const modal = usePersistedModalState<AdminData>({
    paramName: MODALS.ADMIN.PARAM_NAME,
  });
  const { userPermissions = [] } = useContentGuard();
  const canAssign = canAssignAdminRole(userPermissions);

  const { useAssignRole } = rolesManagementMutations();
  const assignRoleMutation = useAssignRole();
  const { useGetRolesForSelect } = rolesManagementQueries();
  const isOpen = modal.isModalOpen(MODALS.ADMIN.ASSIGN_ROLE);
  const { data: rolesData, isLoading: isLoadingRoles } = useGetRolesForSelect();

  const roles = useMemo(() => {
    if (Array.isArray(rolesData)) return rolesData;
    if (rolesData && Array.isArray((rolesData as { data?: unknown[] }).data)) {
      return (rolesData as { data: Array<{ id: string; role: string }> }).data;
    }
    return [];
  }, [rolesData]);

  const roleOptions = useMemo(
    () =>
      roles.map((role) => ({
        label: role.role,
        value: String(role.id),
      })),
    [roles]
  );

  const form = useCustomForm({
    resolver: zodResolver(assignAdminRoleSchema),
    defaultValues: {
      role_id: '',
    },
  });

  useEffect(() => {
    if (!modal.modalData) return;

    const currentRoleId =
      modal.modalData.role_id != null ? String(modal.modalData.role_id) : '';
    form.reset({
      role_id: currentRoleId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal.modalData?.id, modal.modalData?.role_id]);

  const onSubmit: SubmitHandler<AssignAdminRoleSchemaType> = (data) => {
    const adminId = modal.modalData?.id != null ? String(modal.modalData.id) : '';
    if (!adminId) return;

    if (!UUID_REGEX.test(adminId) || !UUID_REGEX.test(data.role_id)) {
      return;
    }

    assignRoleMutation.mutate(
      {
        admin_id: adminId,
        role_id: data.role_id,
      },
      {
        onSuccess: () => {
          modal.closeModal();
          form.reset({ role_id: '' });
        },
      }
    );
  };

  const adminName = getAdminDisplayName(modal.modalData);

  if (!canAssign) {
    return (
      <Modal
        panelClass="!w-[500px]"
        title="Change Admin Role"
        isOpen={isOpen}
        setIsOpen={(open) => {
          if (!open) modal.closeModal();
        }}
        position="center"
      >
        <div className="p-6">
          <Text variant="span" className="text-sm text-gray-700">
            Your account has{' '}
            <strong className="font-medium">roles:get</strong> but not{' '}
            <strong className="font-medium">roles:assign</strong>. A super admin
            must add the <strong className="font-medium">roles:assign</strong>{' '}
            permission to your role. Log out and back in after it is added.
          </Text>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      panelClass="!w-[500px]"
      title="Change Admin Role"
      isOpen={isOpen}
      setIsOpen={(open) => {
        if (!open) {
          modal.closeModal();
          form.reset({ role_id: '' });
        }
      }}
      position="center"
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="p-6 flex flex-col gap-6">
          <div className="space-y-1">
            <Text variant="span" className="text-gray-500 text-sm">
              Admin
            </Text>
            <Text variant="span" weight="medium" className="text-gray-900">
              {adminName}
            </Text>
            {modal.modalData?.email ? (
              <Text variant="span" className="text-gray-500 text-sm block">
                {modal.modalData.email}
              </Text>
            ) : null}
          </div>

          {modal.modalData?.role_name ? (
            <Text variant="span" className="text-sm text-gray-600">
              Current role: {modal.modalData.role_name}
            </Text>
          ) : null}

          <Controller
            control={form.control}
            name="role_id"
            render={({ field }) => (
              <Combobox
                label="Role"
                placeholder={
                  isLoadingRoles ? 'Loading roles...' : 'Select role'
                }
                options={roleOptions}
                value={field.value}
                onChange={(e: { target: { value: string } }) => {
                  field.onChange(e.target.value);
                }}
                error={form.formState.errors.role_id?.message}
                isDisabled={isLoadingRoles || roleOptions.length === 0}
              />
            )}
          />

          <Text variant="span" className="text-xs text-gray-500">
            The assigned admin must log in again for the new role permissions to
            take effect.
          </Text>

          <div className="flex gap-4 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                modal.closeModal();
                form.reset({ role_id: '' });
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="secondary"
              disabled={
                assignRoleMutation.isPending ||
                isLoadingRoles ||
                roleOptions.length === 0
              }
            >
              {assignRoleMutation.isPending ? 'Saving...' : 'Save Role'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
