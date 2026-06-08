import type { CsvHeader } from '@/types/shared';
import { VendorActionCell } from './VendorActionCell';
import { VendorStatusCell } from './VendorStatusCell';

export const vendorListColumns = [
  {
    header: 'Vendor ID',
    accessorKey: 'gvid',
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
    header: 'Vendor Status',
    accessorKey: 'vendor_status',
    cell: VendorStatusCell,
  },
  {
    header: 'Approval Status',
    accessorKey: 'approval_status',
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
    name: 'Vendor Status',
    accessor: 'vendor_status',
  },
  {
    name: 'Approval Status',
    accessor: 'approval_status',
  },
  {
    name: 'Vendor ID',
    accessor: 'gvid',
  },
];
