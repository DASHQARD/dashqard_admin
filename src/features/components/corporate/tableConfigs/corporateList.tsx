import { Dropdown, StatusCell } from '@/components';
import { useCorporateManagementBase } from '@/features/hooks/corporateManagement';
import { useContentGuard, usePersistedModalState } from '@/hooks';
import { Icon } from '@/libs';
import { useAuthStore } from '@/stores';
import type { CsvHeader, TableCellProps } from '@/types/shared';
import { formatDate, MODALS } from '@/utils';
import { useNavigate } from 'react-router';

export const corporateListColumns = [
  {
    header: 'Corporate ID',
    accessorKey: 'corporate_id',
  },
  {
    header: 'Company Name',
    accessorKey: 'business_name',
  },

  {
    header: 'Location',
    accessorKey: 'business_address',
  },
  {
    header: 'Phone Number',
    accessorKey: 'phonenumber',
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
    cell: CorporateActionCell,
  },
];

export const corporateListCsvHeaders: Array<CsvHeader> = [
  {
    name: 'Corporate ID',
    accessor: 'corporate_id',
  },
  {
    name: 'Company Name',
    accessor: 'business_name',
  },

  {
    name: 'Location',
    accessor: 'business_address',
  },
  {
    name: 'Phone Number',
    accessor: 'phonenumber',
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

export function CorporateActionCell({ row }: TableCellProps<{ id: string }>) {
  const navigate = useNavigate();
  const { getCorporateOptions } = useCorporateManagementBase();
  const modal = usePersistedModalState({
    paramName: MODALS.CORPORATE_MANAGEMENT.ROOT,
  });

  const { userPermissions = [] } = useContentGuard();
  const user = useAuthStore().user;

  return (
    <Dropdown
      actions={getCorporateOptions({
        modal,
        corporate: row.original as any,
        option: {
          hasView: true,
          hasDeactivate: true,
          hasActivate: true,
          hasUpdate: true,
        },
        loginUser: user!,
        userPermissions,
        navigate,
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
