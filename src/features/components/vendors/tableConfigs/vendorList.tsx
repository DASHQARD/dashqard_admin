import { CustomIcon, Dropdown, StatusCell } from '@/components';
import { useContentGuard } from '@/hooks';
import { useAuthStore } from '@/stores';
import type { CsvHeader, TableCellProps } from '@/types/shared';
import { formatDate } from '@/utils';
import { useNavigate } from 'react-router';

export const vendorListColumns = [
  {
    header: 'Branch Name',
    accessorKey: 'branch_name',
  },
  {
    header: 'Location',
    accessorKey: 'branch_location',
  },
  // {
  //   header: 'Payment Method',
  //   accessorKey: 'payment_method',
  // },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: StatusCell,
  },
  {
    id: 'actions',
    header: '',
    accessorKey: '',
    cell: VendorActionCell,
  },
];

export const vendorListCsvHeaders: Array<CsvHeader> = [
  {
    name: 'Branch Name',
    accessor: 'branch_name',
  },
  {
    name: 'Location',
    accessor: 'branch_location',
  },
  {
    name: 'Branch Manager',
    accessor: 'branch_manager_name',
  },
  {
    name: 'Manager Email',
    accessor: 'branch_manager_email',
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

export function VendorActionCell({ row }: TableCellProps<{ id: string }>) {
  const navigate = useNavigate();

  const { userPermissions = [] } = useContentGuard();
  const user = useAuthStore().user;

  return (
    <Dropdown
      actions={getVendorOptions({
        modal,
        vendor: row.original as IVendor,
        option: {
          hasView: true,
          hasDeactivate: true,
          hasActivate: true,
          hasUpdate: true,
        },
        loginUser: user!,
        userPermissions,
        entity: 'VENDORS',
        navigate,
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
