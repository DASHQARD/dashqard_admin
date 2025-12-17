import { CustomIcon, DateCell, Dropdown, StatusCell } from '@/components';
import type { CsvHeader, TableCellProps } from '@/types';
import { formatCurrency, formatDate } from '@/utils';

export const customerListColumns = [
  {
    header: 'name',
    accessorKey: 'group_name',
  },
  {
    header: 'Total Participants',
    accessorKey: 'total_participants',
  },
  {
    header: 'Total Contributions',
    accessorKey: 'total_contributions',
    transform: (value: number) => formatCurrency(value),
  },
  {
    header: 'Date Created',
    accessorKey: 'created_at',
    cell: DateCell,
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
    cell: ActionCell,
  },
];

export const customerListCsvHeaders: Array<CsvHeader> = [
  {
    name: 'Group Name',
    accessor: 'group_name',
  },
  {
    name: 'Total Participants',
    accessor: 'num_participants',
  },
  {
    name: 'Total Contributions',
    accessor: 'total_contributions',
    transform: (value: number) => formatCurrency(value),
  },
  {
    name: 'Date Created',
    accessor: 'created_at',
    transform: (value) => formatDate(value, 'DD MMM YYYY'),
  },
  {
    name: 'Status',
    accessor: 'status',
  },
];

function ActionCell({ row }: TableCellProps<{ id: string }>) {
  const { getSavingsOptions } = useCustomersManagementBase();

  return (
    <Dropdown
      actions={getSavingsOptions(row.original as ISavingsAjo, {
        hasView: true,
      })}
    >
      <button
        type="button"
        className="btn rounded-lg no-print"
        aria-label="View actions"
      >
        <CustomIcon name="MoreVertical" width={24} height={24} />
      </button>
    </Dropdown>
  );
}
