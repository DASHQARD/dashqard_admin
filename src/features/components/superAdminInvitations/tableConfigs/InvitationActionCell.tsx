import { Dropdown } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { Icon } from '@/libs';
import type { TableCellProps } from '@/types/shared';
import { MODALS } from '@/utils/constants';

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
