import { DateCell, StatusCell } from '@/components';
import type { CsvHeader } from '@/types/shared';
import { formatDate } from '@/utils';
import { RequestVendorActionCell } from './RequestVendorActionCell';

export const requestVendorListColumns = [
  {
    header: 'Request ID',
    accessorKey: 'request_id',
  },
  {
    header: 'Full Name',
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
    cell: RequestVendorActionCell,
  },
];

export const requestVendorListCsvHeaders: Array<CsvHeader> = [
  {
    name: 'Request ID',
    accessor: 'request_id',
  },
  {
    name: 'Full Name',
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
