import { DateCell, Dropdown } from '@/components';
import { permissionsManagementMutations } from '@/features/hooks/permissionsManagement';
import { useContentGuard, usePersistedModalState } from '@/hooks';
import { Icon } from '@/libs';
import { useAuthStore } from '@/stores';
import type { CsvHeader, TableCellProps } from '@/types/shared';
import { MODALS } from '@/utils/constants';

export const permissionListColumns = [
  {
    header: 'ID',
    accessorKey: 'id',
  },
  {
    header: 'Permission',
    accessorKey: 'permission',
  },
  {
    header: 'Category',
    accessorKey: 'category',
  },
  {
    header: 'Description',
    accessorKey: 'description',
  },
  {
    header: 'Created At',
    accessorKey: 'created_at',
    cell: DateCell,
  },
  {
    id: 'actions',
    header: '',
    accessorKey: '',
    cell: PermissionActionCell,
  },
];

export const permissionListCsvHeaders: Array<CsvHeader> = [
  {
    name: 'ID',
    accessor: 'id',
  },
  {
    name: 'Permission',
    accessor: 'permission',
  },
  {
    name: 'Category',
    accessor: 'category',
  },
  {
    name: 'Description',
    accessor: 'description',
  },
  {
    name: 'Created At',
    accessor: 'created_at',
  },
];

export function PermissionActionCell({ row }: TableCellProps<{ id: number }>) {
  const modal = usePersistedModalState({
    paramName: MODALS.PERMISSIONS_MANAGEMENT.PARAM_NAME,
  });

  const { userPermissions = [] } = useContentGuard();
  const user = useAuthStore().user;
  const { useDeletePermission } = permissionsManagementMutations();
  const deletePermissionMutation = useDeletePermission();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this permission?')) {
      deletePermissionMutation.mutate(String(row.original.id), {
        onSuccess: () => {
          modal.closeModal();
        },
      });
    }
  };

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
