import { DateCell } from '@/components';
import type { CsvHeader } from '@/types/shared';
import { formatDate } from '@/utils';
import { UserActionCell } from './UserActionCell';

export const userListColumns = [
  {
    header: 'User ID',
    accessorKey: 'id',
  },
  {
    header: 'Full Name',
    accessorKey: 'name',
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
    cell: UserActionCell,
  },
];

export const userListCsvHeaders: Array<CsvHeader> = [
  {
    name: 'User ID',
    accessor: 'id',
  },
  {
    name: 'Full Name',
    accessor: 'name',
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
