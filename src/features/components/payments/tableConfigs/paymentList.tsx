import { DateCell, Dropdown, StatusCell } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { Icon } from '@/libs';
import type { CsvHeader, TableCellProps } from '@/types/shared';
import { formatDate, MODALS } from '@/utils';

export const paymentListColumns = [
  { header: 'ID', accessorKey: 'id' },
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
    cell: DateCell,
  },
  { id: 'actions', header: '', accessorKey: '', cell: PaymentActionCell },
];

export const paymentListCsvHeaders: Array<CsvHeader> = [
  { name: 'ID', accessor: 'id' },
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
    transform: (value) => formatDate(value, 'DD MMM YYYY'),
  },
];

type PaymentData = {
  id: number | string;
  trans_id?: string;
  receipt_number?: string;
  amount?: string | number;
  currency?: string;
  status?: string;
  type?: string;
  user_name?: string;
  user_id?: number | string;
};

export function PaymentActionCell({ row }: TableCellProps<PaymentData>) {
  const modal = usePersistedModalState<PaymentData>({
    paramName: MODALS.PAYMENTS_MANAGEMENT.PARAM_NAME,
  });

  const actions = [
    {
      label: 'View',
      icon: 'bi:eye',
      onClickFn: () => {
        modal.openModal(MODALS.PAYMENTS_MANAGEMENT.CHILDREN.VIEW, row.original);
      },
    },
    {
      label: 'Update Status',
      icon: 'bi:arrow-repeat',
      onClickFn: () => {
        modal.openModal(
          MODALS.PAYMENTS_MANAGEMENT.CHILDREN.UPDATE_STATUS,
          row.original
        );
      },
    },
    {
      label: 'Delete',
      icon: 'bi:trash',
      onClickFn: () => {
        modal.openModal(MODALS.PAYMENTS_MANAGEMENT.CHILDREN.DELETE, row.original);
      },
    },
  ];

  return (
    <div className="flex justify-end">
      <Dropdown actions={actions}>
        <button className="p-2 hover:bg-gray-100 rounded">
          <Icon icon="bi:three-dots-vertical" className="w-5 h-5" />
        </button>
      </Dropdown>
    </div>
  );
}

