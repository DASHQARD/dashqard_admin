import { Dropdown } from '@/components';
import { useAdminManagementBase } from '@/features/hooks';
import { useContentGuard, usePersistedModalState } from '@/hooks';
import { Icon } from '@/libs';
import { useAuthStore } from '@/stores';
import type { TableCellProps } from '@/types/shared';
import { MODALS } from '@/utils/constants';

export function AdminActionCell({ row }: TableCellProps<{ id: string }>) {
  const modal = usePersistedModalState({
    paramName: MODALS.ADMIN.ROOT,
  });

  const { getAdminOptions } = useAdminManagementBase();
  const { userPermissions = [] } = useContentGuard();
  const user = useAuthStore().user;

  return (
    <Dropdown
      actions={getAdminOptions({
        modal,
        admin: row.original as any,
        option: {
          hasView: true,
          hasAssignRole: true,
          hasActivate: true,
        },
        loginUser: user!,
        userPermissions,
      })}
    >
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
