import { DateCell, Dropdown, StatusCell } from '@/components';
import { useRequestManagementBase } from '@/features/hooks/requestManagement ';
import { useContentGuard, usePersistedModalState } from '@/hooks';
import { Icon } from '@/libs';
import { useAuthStore } from '@/stores';
import type { CsvHeader, TableCellProps } from '@/types/shared';
import { formatDate, MODALS } from '@/utils';

export const requestCorporateListColumns = [
  {
    header: 'Request ID',
    accessorKey: 'request_id',
  },
  {
    header: 'Name',
    accessorKey: 'name',
  },
  {
    header: 'User Type',
    accessorKey: 'user_type',
  },
  {
    header: 'Type',
    accessorKey: 'type',
  },
  {
    header: 'Description',
    accessorKey: 'description',
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: StatusCell,
  },
  {
    header: 'Entity ID',
    accessorKey: 'entity_id',
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
    cell: RequestCorporateActionCell,
  },
];

export const requestCorporateListCsvHeaders: Array<CsvHeader> = [
  {
    name: 'Request ID',
    accessor: 'request_id',
  },
  {
    name: 'Name',
    accessor: 'name',
  },
  {
    name: 'User Type',
    accessor: 'user_type',
  },
  {
    name: 'Type',
    accessor: 'type',
  },
  {
    name: 'Description',
    accessor: 'description',
  },
  {
    name: 'Status',
    accessor: 'status',
  },
  {
    name: 'Entity ID',
    accessor: 'entity_id',
  },
  {
    name: 'Created At',
    accessor: 'created_at',
    transform: (value) => formatDate(value, 'DD MMM YYYY'),
  },
];

export function RequestCorporateActionCell({
  row,
}: TableCellProps<{ id: string }>) {
  const { getRequestCorporateOptions } = useRequestManagementBase();
  const modal = usePersistedModalState({
    paramName: MODALS.REQUEST_CORPORATE_MANAGEMENT.PARAM_NAME,
  });

  const { userPermissions = [] } = useContentGuard();
  const user = useAuthStore().user;

  return (
    <Dropdown
      actions={getRequestCorporateOptions({
        modal,
        requestCorporate: row.original as any,
        option: {
          hasView: true,
          hasApprove: true,
          hasReject: true,
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
