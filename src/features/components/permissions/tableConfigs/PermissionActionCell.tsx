import { Dropdown } from '@/components';
import { useContentGuard, usePersistedModalState } from '@/hooks';
import { Icon } from '@/libs';
import { useAuthStore } from '@/stores';
import type { TableCellProps } from '@/types/shared';
import { MODALS } from '@/utils/constants';

export function PermissionActionCell({
  row,
}: TableCellProps<{ id: number }>) {
  const modal = usePersistedModalState({
    paramName: MODALS.PERMISSIONS_MANAGEMENT.PARAM_NAME,
  });

  const { userPermissions = [] } = useContentGuard();
  const user = useAuthStore().user;

  const actions = [];

  if (
    userPermissions.some(
      (p) =>
        p.toLowerCase().includes('permissions:update') ||
        p.toLowerCase().includes('permissions management edit')
    ) ||
    user?.isSuperAdmin
  ) {
    actions.push({
      label: 'Edit',
      onClickFn: () =>
        modal.openModal(
          MODALS.PERMISSIONS_MANAGEMENT.CHILDREN.EDIT,
          row.original
        ),
    });
  }

  if (
    userPermissions.some(
      (p) =>
        p.toLowerCase().includes('permissions:delete') ||
        p.toLowerCase().includes('permissions management delete')
    ) ||
    user?.isSuperAdmin
  ) {
    actions.push({
      label: 'Delete',
      onClickFn: () =>
        modal.openModal(
          MODALS.PERMISSIONS_MANAGEMENT.CHILDREN.DELETE,
          row.original
        ),
    });
  }

  return (
    <Dropdown actions={actions}>
      <button
        type="button"
        className="btn rounded-lg no-print"
        aria-label="View actions"
      >
        <Icon icon="hugeicons:more-vertical" width={24} height={24} />
      </button>
    </Dropdown>
  );
}
