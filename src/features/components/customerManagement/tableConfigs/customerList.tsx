import { DateCell, StatusCell } from '@/components';
import type { CsvHeader } from '@/types';
import { formatDate } from '@/utils';
import { ActionCell } from './ActionCell';

// Helper function to format nullable values
const formatValue = (value: any) => {
  if (value === null || value === undefined || value === '') {
    return 'N/A';
  }
  return value;
};

export const customerListColumns = [
  {
    header: 'User ID',
    accessorKey: 'user_id',
    cell: ({ getValue }: { getValue: () => any }) => (
      <div>{formatValue(getValue())}</div>
    ),
  },
  {
    header: 'Full Name',
    accessorKey: 'fullname',
    cell: ({ getValue }: { getValue: () => any }) => (
      <div>{formatValue(getValue())}</div>
    ),
  },
  {
    header: 'Email',
    accessorKey: 'email',
    cell: ({ getValue }: { getValue: () => any }) => (
      <div>{formatValue(getValue())}</div>
    ),
  },
  {
    header: 'Phone Number',
    accessorKey: 'phonenumber',
    cell: ({ getValue }: { getValue: () => any }) => (
      <div>{formatValue(getValue())}</div>
    ),
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
