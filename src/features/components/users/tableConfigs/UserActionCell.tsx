import { Dropdown } from '@/components';
import { Icon } from '@/libs';
import { usePersistedModalState } from '@/hooks';
import type { TableCellProps } from '@/types/shared';
import { MODALS } from '@/utils/constants';
import type { User } from '@/types/user';
import { useNavigate } from 'react-router-dom';

export function UserActionCell({ row }: TableCellProps<User>) {
  const navigate = useNavigate();
  const user = row.original;
  const modal = usePersistedModalState({
    paramName: MODALS.CUSTOMER.ROOT,
  });

  const actions = [
    {
      label: 'View Details',
      onClickFn: () => {
        modal.openModal(MODALS.CUSTOMER.VIEW, user);
      },
    },
    {
      label: 'Manage Status',
      onClickFn: () => {
        navigate(`?manage-status=${user.id}`);
      },
    },
  ];

  return (
    <Dropdown actions={actions}>
      <button
        type="button"
        className="btn rounded-lg no-print"
        aria-label="View actions"
      >
        <Icon icon="hugeicons:more-vertical" width={24} height={24} />
      </button>
    </Dropdown>
  );
}
