import { Dropdown } from '@/components';
import { useContentGuard, usePersistedModalState } from '@/hooks';
import { Icon } from '@/libs';
import { useAuthStore } from '@/stores';
import { MODALS } from '@/utils/constants';

type Role = {
  id: number | string;
  role: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  permissions?: string[] | Array<{ permission: string }>;
};

type RoleCardProps = {
  role: Role;
};

export function RoleCard({ role }: RoleCardProps) {
  const modal = usePersistedModalState({
    paramName: MODALS.ROLES_MANAGEMENT.PARAM_NAME,
  });

  const { userPermissions = [] } = useContentGuard();
  const user = useAuthStore().user;

  const actions = [];

  if (
    userPermissions.some(
      (p) =>
        p.toLowerCase().includes('roles:get') ||
        p.toLowerCase().includes('roles view')
    ) ||
    user?.isSuperAdmin
  ) {
    actions.push({
      label: 'View',
      onClickFn: () =>
        modal.openModal(MODALS.ROLES_MANAGEMENT.CHILDREN.VIEW, role),
    });
  }

  if (
    userPermissions.some(
      (p) =>
        p.toLowerCase().includes('roles:update') ||
        p.toLowerCase().includes('roles edit')
    ) ||
    user?.isSuperAdmin
  ) {
    actions.push({
      label: 'Edit',
      onClickFn: () =>
        modal.openModal(MODALS.ROLES_MANAGEMENT.CHILDREN.EDIT, role),
    });
  }

  if (
    userPermissions.some(
      (p) =>
        p.toLowerCase().includes('roles:delete') ||
        p.toLowerCase().includes('roles delete')
    ) ||
    user?.isSuperAdmin
  ) {
    actions.push({
      label: 'Delete',
      onClickFn: () =>
        modal.openModal(MODALS.ROLES_MANAGEMENT.CHILDREN.DELETE, role),
    });
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow relative">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {role.role}
          </h3>
          <p className="text-sm text-gray-600 mb-2">{role.description}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>ID: {role.id}</span>
            {role.created_at && (
              <span>
                Created: {new Date(role.created_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        {actions.length > 0 && (
          <Dropdown actions={actions}>
            <button
              type="button"
              className="btn rounded-lg no-print p-2"
              aria-label="View actions"
            >
              <Icon icon="hugeicons:more-vertical" width={20} height={20} />
            </button>
          </Dropdown>
        )}
      </div>
    </div>
  );
}
