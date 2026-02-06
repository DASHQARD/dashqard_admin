import { Dropdown } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { Icon } from '@/libs';
import type { TableCellProps } from '@/types/shared';
import { MODALS } from '@/utils';

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
        modal.openModal(
          MODALS.PAYMENTS_MANAGEMENT.CHILDREN.DELETE,
          row.original
        );
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
