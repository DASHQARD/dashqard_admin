import { Dropdown } from '@/components';
import { useRequestManagementBase } from '@/features/hooks/requestManagement ';
import { useContentGuard, usePersistedModalState } from '@/hooks';
import { Icon } from '@/libs';
import { useAuthStore } from '@/stores';
import type { TableCellProps } from '@/types/shared';
import { MODALS } from '@/utils';

export function RequestVendorActionCell({
  row,
}: TableCellProps<{ id: string }>) {
  const { getRequestVendorOptions } = useRequestManagementBase();
  const modal = usePersistedModalState({
    paramName: MODALS.REQUEST_VENDOR_MANAGEMENT.PARAM_NAME,
  });

  const { userPermissions = [] } = useContentGuard();
  const user = useAuthStore().user;

  return (
    <Dropdown
      actions={getRequestVendorOptions({
        modal,
        requestVendor: row.original as any,
        option: {
          hasView: true,
          hasApprove: true,
          hasReject: true,
          hasDelete: true,
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
