import { DateCell } from '@/components';
import type { CsvHeader } from '@/types/shared';
import { PermissionActionCell } from './PermissionActionCell';

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
