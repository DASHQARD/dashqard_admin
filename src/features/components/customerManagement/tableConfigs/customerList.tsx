import { DateCell, StatusCell } from '@/components';
import type { CsvHeader } from '@/types';
import { formatDate } from '@/utils';
import { ActionCell } from './ActionCell';

export const customerListColumns = [
  {
    header: 'User ID',
    accessorKey: 'id',
  },
  {
    header: 'User ID',
    accessorKey: 'user_id',
  },
  {
    header: 'Full Name',
    accessorKey: 'fullname',
  },
  {
    header: 'Email',
    accessorKey: 'email',
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
    header: 'Created At',
    accessorKey: 'created_at',
    cell: DateCell,
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
    name: 'Customer ID',
    accessor: 'id',
  },
  {
    name: 'User ID',
    accessor: 'user_id',
  },
  {
    name: 'Full Name',
    accessor: 'name',
  },
  {
    name: 'Email',
    accessor: 'email',
  },
  {
    name: 'Phone Number',
    accessor: 'phonenumber',
  },
  {
    name: 'Status',
    accessor: 'status',
  },
  {
    name: 'Created At',
    accessor: 'created_at',
    transform: (value: string) => formatDate(value, 'DD MMM YYYY'),
  },
  {
    name: 'Type',
    accessor: 'type',
  },
  {
    name: 'Description',
    accessor: 'description',
  },
];
