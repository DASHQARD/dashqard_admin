import { DateCell, StatusCell } from '@/components';
import type { CsvHeader } from '@/types/shared';
import { VendorPaymentActionCell } from './VendorPaymentActionCell';

export const vendorPaymentListColumns = [
  {
    header: 'Vendor Name',
    accessorKey: 'vendor_name',
  },
  {
    header: 'Payment Frequency',
    accessorKey: 'payment_frequency',
  },
  {
    header: 'Branch Location',
    accessorKey: 'branch_location',
  },
  {
    header: 'Payment Amount',
    accessorKey: 'payment_amount',
  },
  {
    header: 'Payment Period',
    accessorKey: 'payment_period',
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: StatusCell,
  },
  {
    header: 'Due Date',
    accessorKey: 'due_date',
    cell: DateCell,
  },
  {
    header: 'Paid Date',
    accessorKey: 'paid_date',
    cell: DateCell,
  },
  {
    id: 'actions',
    header: '',
    accessorKey: '',
    cell: VendorPaymentActionCell,
  },
];

export const vendorPaymentListCsvHeaders: Array<CsvHeader> = [
  {
    name: 'Vendor Name',
    accessor: 'vendor_name',
  },
  {
    name: 'Payment Frequency',
    accessor: 'payment_frequency',
  },
  {
    name: 'Branch Location',
    accessor: 'branch_location',
  },
  {
    name: 'Payment Amount',
    accessor: 'payment_amount',
  },
  {
    name: 'Payment Period',
    accessor: 'payment_period',
  },
  {
    name: 'Status',
    accessor: 'status',
  },
  {
    name: 'Due Date',
    accessor: 'due_date',
  },
  {
    name: 'Paid Date',
    accessor: 'paid_date',
  },
];
