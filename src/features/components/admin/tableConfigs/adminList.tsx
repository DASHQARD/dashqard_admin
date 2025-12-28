import { Dropdown, NameCell, StatusCell } from '@/components';
import { useAdminManagementBase } from '@/features/hooks';
import { useContentGuard, usePersistedModalState } from '@/hooks';
import { Icon } from '@/libs';
import { useAuthStore } from '@/stores';
import type { CsvHeader, TableCellProps } from '@/types/shared';
import { MODALS } from '@/utils/constants';

export const adminListColumns = [
  {
    header: 'Full Name',
    accessorKey: 'full_name',
    cell: NameCell,
  },
  {
    header: 'Email',
    accessorKey: 'email',
  },
  {
    header: 'Phone Number',
    accessorKey: 'phone_number',
  },
  {
    header: 'Type',
    accessorKey: 'type',
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: StatusCell,
  },
  {
    id: 'actions',
    header: '',
    accessorKey: '',
    cell: AdminActionCell,
  },
];

export const adminListCsvHeaders: Array<CsvHeader> = [
  {
    name: 'Full Name',
    accessor: 'full_name',
  },
  {
    name: 'Email',
    accessor: 'email',
  },
  {
    name: 'Phone Number',
    accessor: 'phone_number',
  },
  {
    name: 'Type',
    accessor: 'type',
  },
  {
    name: 'Date Created',
    accessor: 'created_at',
  },
];

export function AdminActionCell({ row }: TableCellProps<{ id: string }>) {
  const modal = usePersistedModalState({
    paramName: MODALS.ADMIN.ROOT,
  });

  const { getAdminOptions } = useAdminManagementBase();
  const { userPermissions = [] } = useContentGuard();
  const user = useAuthStore().user;

  return (
    <Dropdown
      actions={getAdminOptions({
        modal,
        admin: row.original as any,
        option: {
          hasView: true,
          hasDeactivate: true,
          hasActivate: true,
          hasUpdate: true,
        },
        loginUser: user!,
        userPermissions,
      })}
    >
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
