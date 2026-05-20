import { DateCellTimestamp, StatusCell } from '@/components';
import type { CsvHeader } from '@/types/shared';
import { formatDate } from '@/utils';
import { PaymentActionCell } from './PaymentActionCell';

export const paymentListColumns = [
  { header: 'Transaction ID', accessorKey: 'trans_id' },
  { header: 'Receipt Number', accessorKey: 'receipt_number' },
  { header: 'User Name', accessorKey: 'user_name' },
  { header: 'Amount', accessorKey: 'amount' },
  { header: 'Currency', accessorKey: 'currency' },
  { header: 'Status', accessorKey: 'status', cell: StatusCell },
  { header: 'Type', accessorKey: 'type' },
  {
    header: 'Created At',
    accessorKey: 'created_at',
    cell: DateCellTimestamp,
  },
  { id: 'actions', header: '', accessorKey: '', cell: PaymentActionCell },
];

export const paymentListCsvHeaders: Array<CsvHeader> = [
  { name: 'Transaction ID', accessor: 'trans_id' },
  { name: 'Receipt Number', accessor: 'receipt_number' },
  { name: 'User Name', accessor: 'user_name' },
  { name: 'Amount', accessor: 'amount' },
  { name: 'Currency', accessor: 'currency' },
  { name: 'Status', accessor: 'status' },
  { name: 'Type', accessor: 'type' },
  {
    name: 'Created At',
    accessor: 'created_at',
    transform: (value) => formatDate(value, 'DD MMM YYYY, HH:mm'),
  },
];
