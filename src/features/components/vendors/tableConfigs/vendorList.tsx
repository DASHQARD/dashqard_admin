import { Dropdown, Tag } from '@/components';
import { useVendorManagementBase } from '@/features/hooks/vendorManagement';
import { useContentGuard, usePersistedModalState } from '@/hooks';
import { Icon } from '@/libs';
import { useAuthStore } from '@/stores';
import type { CsvHeader, TableCellProps } from '@/types/shared';
import { MODALS, getStatusVariant } from '@/utils';

export const vendorListColumns = [
  {
    header: 'Vendor ID',
    accessorKey: 'vendor_id',
  },
  {
    header: 'Vendor Name',
    accessorKey: 'vendor_name',
  },
  {
    header: 'Business Name',
    accessorKey: 'business_name',
  },
  {
    header: 'Vendor User Type',
    accessorKey: 'vendor_user_type',
  },
  {
    header: 'Vendor Status',
    accessorKey: 'vendor_status',
    cell: VendorStatusCell,
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
    name: 'Vendor Name',
    accessor: 'vendor_name',
  },
  {
    name: 'Business Name',
    accessor: 'business_name',
  },
  {
    name: 'Vendor User Type',
    accessor: 'vendor_user_type',
  },
  {
    name: 'Vendor Status',
    accessor: 'vendor_status',
  },
  {
    name: 'Vendor ID',
    accessor: 'vendor_id',
  },
];

function VendorStatusCell({ getValue }: { getValue: () => string }) {
  const status = getValue();
  return (
    <>
      {status ? <Tag value={status} variant={getStatusVariant(status)} /> : '-'}
    </>
  );
}

export function VendorActionCell({ row }: TableCellProps<{ id: string }>) {
  const { getVendorOptions } = useVendorManagementBase();
  const modal = usePersistedModalState({
    paramName: MODALS.VENDOR_MANAGEMENT.PARAM_NAME,
  });

  const { userPermissions = [] } = useContentGuard();
  const user = useAuthStore().user;

  console.log('userPermissions', userPermissions);

  return (
    <Dropdown
      actions={getVendorOptions({
        modal,
        vendor: row.original as any,
        option: {
          hasView: true,
          hasDeactivate: true,
          hasActivate: true,
          hasUpdate: true,
          hasDelete: true,
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
