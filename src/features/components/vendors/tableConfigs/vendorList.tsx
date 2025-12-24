import { Dropdown, StatusCell } from '@/components';
import { useVendorManagementBase } from '@/features/hooks/vendorManagement';
import { useContentGuard, usePersistedModalState } from '@/hooks';
import { Icon } from '@/libs';
import { useAuthStore } from '@/stores';
import type { CsvHeader, TableCellProps } from '@/types/shared';
import { MODALS } from '@/utils/constants';

// {
//               "id": 1,
//               "corporate_user_id": 12,
//               "vendor_user_id": 12,
//               "vendor_id": 1,
//               "created_by_user_id": 12,
//               "relationship_type": "owner_managed",
//               "approval_status": "auto_approved",
//               "status": "active",
//               "approved_by_admin_id": null,
//               "approved_at": null,
//               "rejection_reason": null,
//               "created_at": "2025-12-23T11:51:38.563Z",
//               "updated_at": "2025-12-23T11:51:38.563Z",
//               "vendor_name": "Abeeku Djokoto",
//               "vendor_email": "wesetavesse-1891@yopmail.com",
//               "vendor_phone": "+233559617908",
//               "vendor_avatar": null,
//               "vendor_user_type": "corporate super admin",
//               "vendor_status": "approved",
//               "corporate_name": "Abeeku Djokoto",
//               "corporate_email": "wesetavesse-1891@yopmail.com",
//               "business_name": "Mart Ghana",
//               "gvid": "GVID-2335-000001",
//               "onboarding_stage": "business_documents",
//               "onboarding_completed": false,
//               "branch_count": "0",
//               "data_references": [
//                   {
//                       "id": 1,
//                       "data_type": "business_details",
//                       "approval_status": "not_required",
//                       "requires_approval": false,
//                       "is_copied_from_corporate": true
//                   }
//               ]
//           }

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
