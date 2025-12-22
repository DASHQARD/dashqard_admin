import { Avatar, Dropdown, StatusCell } from '@/components';
import { useAdminManagementBase } from '@/features/hooks';
import { useContentGuard, usePersistedModalState } from '@/hooks';
import { Icon } from '@/libs';
import { useAuthStore } from '@/stores';
import type { CsvHeader, TableCellProps } from '@/types/shared';
import { MODALS } from '@/utils/constants';
import { useNavigate } from 'react-router';

export const adminListColumns = [
  {
    header: 'Full Name',
    accessorKey: 'full_name',
    cell: (row: any) => (
      <div className="flex items-center gap-2">
        <Avatar
          src={row.avatar}
          alt={row.full_name}
          className="w-10 h-10 rounded-full"
        />
        <span>
          {row.first_name} {row.last_name}
        </span>
      </div>
    ),
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
  const navigate = useNavigate();
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
        navigate,
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
