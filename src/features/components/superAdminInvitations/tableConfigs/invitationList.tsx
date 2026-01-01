import { Dropdown, StatusCell, EmailCell, DateCell } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { Icon } from '@/libs';
import type { CsvHeader, TableCellProps } from '@/types/shared';
import { MODALS } from '@/utils/constants';

// Helper cell component for nullable text fields
function NullableTextCell({ getValue }: Readonly<{ getValue: () => string | null | undefined }>) {
  const value = getValue();
  return <div>{value || '-'}</div>;
}

export const invitationListColumns = [
  {
    header: 'Email',
    accessorKey: 'user_email',
    cell: EmailCell,
  },
  {
    header: 'Full Name',
    accessorKey: 'user_fullname',
    cell: NullableTextCell,
  },
  {
    header: 'Phone Number',
    accessorKey: 'user_phonenumber',
  },
  {
    header: 'Business Name',
    accessorKey: 'business_name',
    cell: NullableTextCell,
  },
  {
    header: 'Business Location',
    accessorKey: 'business_location',
    cell: NullableTextCell,
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: StatusCell,
  },
  {
    header: 'Created At',
    accessorKey: 'created_at',
    cell: DateCell,
  },
  {
    id: 'actions',
    header: '',
    accessorKey: '',
    cell: InvitationActionCell,
  },
];

export const invitationListCsvHeaders: Array<CsvHeader> = [
  {
    name: 'Email',
    accessor: 'user_email',
  },
  {
    name: 'Full Name',
    accessor: 'user_fullname',
  },
  {
    name: 'Phone Number',
    accessor: 'user_phonenumber',
  },
  {
    name: 'Business Name',
    accessor: 'business_name',
  },
  {
    name: 'Business Location',
    accessor: 'business_location',
  },
  {
    name: 'Status',
    accessor: 'status',
  },
  {
    name: 'Created At',
    accessor: 'created_at',
  },
];

type InvitationData = {
  id: number | string;
  user_id?: number;
  user_email?: string;
  user_fullname?: string | null;
  user_phonenumber?: string;
  user_avatar?: string | null;
  user_status?: string;
  business_name?: string | null;
  business_location?: string | null;
  status?: string;
  created_at?: string;
  updated_at?: string;
};

export function InvitationActionCell({
  row,
}: TableCellProps<InvitationData>) {
  const modal = usePersistedModalState<InvitationData>({
    paramName: MODALS.SUPER_ADMIN_INVITATIONS_MANAGEMENT.PARAM_NAME,
  });

  const invitationData = (row.original || row) as InvitationData;

  const actions = [
    {
      label: 'Update Status',
      onClickFn: () => {
        modal.openModal(
          MODALS.SUPER_ADMIN_INVITATIONS_MANAGEMENT.CHILDREN.UPDATE_STATUS,
          invitationData
        );
      },
    },
    {
      label: 'Delete',
      onClickFn: () => {
        modal.openModal(
          MODALS.SUPER_ADMIN_INVITATIONS_MANAGEMENT.CHILDREN.DELETE,
          invitationData
        );
      },
      className: 'text-error',
    },
  ];

  return (
    <div className="flex justify-end">
      <Dropdown actions={actions}>
        <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">
          <Icon icon="bi:three-dots-vertical" className="w-5 h-5" />
        </div>
      </Dropdown>
    </div>
  );
}
