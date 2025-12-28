import { DateCell, Dropdown, StatusCell } from '@/components';
import { useContentGuard, usePersistedModalState } from '@/hooks';
import { Icon } from '@/libs';
import { useAuthStore } from '@/stores';
import type { CsvHeader, TableCellProps } from '@/types/shared';
import { formatDate, MODALS } from '@/utils';

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
