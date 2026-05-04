import { NameCell, StatusCell } from '@/components';
import type { CsvHeader } from '@/types/shared';
import { AdminActionCell } from './AdminActionCell';

export const adminListColumns = [
  {
    header: 'Full Name',
    accessorKey: 'full_name',
    cell: NameCell,
  },
  {
    header: 'Email',
    accessorKey: 'email',
  },
  {
    header: 'Phone Number',
    accessorKey: 'phone_number',
  },
  {
    header: 'Type',
    accessorKey: 'type',
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
    cell: AdminActionCell,
  },
];

function adminFullNameForExport(row: any): string {
  if (!row || typeof row !== 'object') return '';
  return (
    row.full_name ??
    `${row.first_name ?? ''} ${row.last_name ?? ''}`.trim()
  ) || '';
}

export const adminListCsvHeaders: Array<CsvHeader> = [
  {
    name: 'Full Name',
    accessor: '',
    transform: adminFullNameForExport,
  },
  {
    name: 'Email',
    accessor: 'email',
  },
  {
    name: 'Phone Number',
    accessor: 'phone_number',
  },
  {
    name: 'Type',
    accessor: 'type',
  },
  {
    name: 'Date Created',
    accessor: 'created_at',
  },
];
