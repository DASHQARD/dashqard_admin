import { DateCell } from '@/components';
import type { CsvHeader } from '@/types/shared';
import { formatDate } from '@/utils';

export const paymentDetailsListColumns = [
  {
    header: 'Date',
    accessorKey: 'date',
    cell: DateCell,
  },
  {
    header: 'Total Count',
    accessorKey: 'total_count',
  },
  {
    header: 'Total Amount',
    accessorKey: 'total_amount',
  },
  {
    header: 'Currency',
    accessorKey: 'currency',
  },
];

export const paymentDetailsListCsvHeaders: Array<CsvHeader> = [
  {
    name: 'Date',
    accessor: 'date',
    transform: (value) => formatDate(value, 'DD MMM YYYY'),
  },
  { name: 'Total Count', accessor: 'total_count' },
  { name: 'Total Amount', accessor: 'total_amount' },
  { name: 'Currency', accessor: 'currency' },
];
