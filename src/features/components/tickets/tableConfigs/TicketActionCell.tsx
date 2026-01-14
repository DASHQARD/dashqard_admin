import { Dropdown } from '@/components';
import { useContentGuard, usePersistedModalState } from '@/hooks';
import { Icon } from '@/libs';
import { useAuthStore } from '@/stores';
import type { TableCellProps } from '@/types/shared';
import { MODALS } from '@/utils';

type TicketData = {
  id: number | string;
  name?: string;
  email?: string;
  subject?: string;
  status?: string;
};

export function TicketActionCell({ row }: TableCellProps<TicketData>) {
  const modal = usePersistedModalState<TicketData>({
    paramName: MODALS.TICKETS_MANAGEMENT.PARAM_NAME,
  });

  const { userPermissions = [] } = useContentGuard();
  const user = useAuthStore().user;

  const actions = [];

  // View action - always available if user can view tickets
  if (
    userPermissions.some(
      (p) =>
        p.toLowerCase().includes('ticket_supports:view') ||
        p.toLowerCase().includes('ticket supports view')
    ) ||
    user?.isSuperAdmin
  ) {
    actions.push({
      label: 'View',
      icon: 'bi:eye',
      onClickFn: () => {
        modal.openModal(MODALS.TICKETS_MANAGEMENT.CHILDREN.VIEW, row.original);
      },
    });
  }

  // Update Status action - requires manage permission
  if (
    userPermissions.some(
      (p) =>
        p.toLowerCase().includes('ticket_supports:manage') ||
        p.toLowerCase().includes('ticket supports manage')
    ) ||
    user?.isSuperAdmin
  ) {
    actions.push({
      label: 'Update Status',
      icon: 'bi:arrow-repeat',
      onClickFn: () => {
        modal.openModal(
          MODALS.TICKETS_MANAGEMENT.CHILDREN.UPDATE_STATUS,
          row.original
        );
      },
    });
  }

  return (
    <div className="flex justify-end">
      <Dropdown actions={actions}>
        <button
          type="button"
          className="btn rounded-lg no-print"
          aria-label="View actions"
        >
          <Icon icon="hugeicons:more-vertical" width={24} height={24} />
        </button>
      </Dropdown>
    </div>
  );
}
