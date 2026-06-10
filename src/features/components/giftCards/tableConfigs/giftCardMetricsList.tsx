import type { CsvHeader } from '@/types/shared';
import type { GiftCardMetricDetail } from '@/types/cards';
import { VendorStatusCell } from '@/features/components/vendors/tableConfigs/VendorStatusCell';
import { formatDate } from '@/utils';
import { formatGiftCardMetricsBalance } from '@/utils/giftCardMetricsDisplay';

export const giftCardMetricsColumns = [
  {
    header: 'Card ID',
    accessorKey: 'card_id',
  },
  {
    header: 'Product',
    accessorKey: 'product',
  },
  {
    header: 'Vendor',
    accessorKey: 'vendor_name',
  },
  {
    header: 'Vendor ID',
    accessorKey: 'gvid',
  },
  {
    header: 'Unredeemed',
    accessorKey: 'unredeemed_amount',
    cell: ({ row }: { row: { original: GiftCardMetricDetail } }) =>
      formatGiftCardMetricsBalance(row.original),
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: VendorStatusCell,
  },
  {
    header: 'Created',
    accessorKey: 'created_at',
    cell: ({ getValue }: { getValue: () => string }) => {
      const value = getValue();
      return value ? formatDate(value, 'DD MMM YYYY') : '-';
    },
  },
];

export const giftCardMetricsCsvHeaders: Array<CsvHeader> = [
  { name: 'Card ID', accessor: 'card_id' },
  { name: 'Product', accessor: 'product' },
  { name: 'Vendor', accessor: 'vendor_name' },
  { name: 'Vendor ID', accessor: 'gvid' },
  { name: 'Unredeemed', accessor: 'unredeemed_amount' },
  { name: 'Currency', accessor: 'currency' },
  { name: 'Status', accessor: 'status' },
  { name: 'Type', accessor: 'type' },
  { name: 'Created', accessor: 'created_at' },
];
