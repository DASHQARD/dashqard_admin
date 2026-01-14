import { DateCell, StatusCell } from '@/components';
import type { CsvHeader } from '@/types/shared';
import { formatDate } from '@/utils';
import { TicketActionCell } from './TicketActionCell';

export const ticketListColumns = [
  { header: 'ID', accessorKey: 'id' },
  { header: 'Name', accessorKey: 'name' },
  { header: 'Email', accessorKey: 'email' },
  { header: 'Subject', accessorKey: 'subject' },
  { header: 'Status', accessorKey: 'status', cell: StatusCell },
  {
    header: 'Created At',
    accessorKey: 'created_at',
    cell: DateCell,
  },
  { id: 'actions', header: '', accessorKey: '', cell: TicketActionCell },
];

export const ticketListCsvHeaders: Array<CsvHeader> = [
  { name: 'ID', accessor: 'id' },
  { name: 'Name', accessor: 'name' },
  { name: 'Email', accessor: 'email' },
  { name: 'Subject', accessor: 'subject' },
  { name: 'Status', accessor: 'status' },
  {
    name: 'Created At',
    accessor: 'created_at',
    transform: (value) => formatDate(value, 'DD MMM YYYY'),
  },
];
