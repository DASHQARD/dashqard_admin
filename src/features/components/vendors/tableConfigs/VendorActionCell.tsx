import { useNavigate } from 'react-router';

import { Dropdown } from '@/components';
import { useVendorManagementBase } from '@/features/hooks/vendorManagement';
import { useContentGuard, usePersistedModalState } from '@/hooks';
import { Icon } from '@/libs';
import { useAuthStore } from '@/stores';
import type { TableCellProps } from '@/types/shared';
import { MODALS } from '@/utils';

export function VendorActionCell({ row }: TableCellProps<{ id: string }>) {
  const { getVendorOptions } = useVendorManagementBase();
  const modal = usePersistedModalState({
    paramName: MODALS.VENDOR_MANAGEMENT.PARAM_NAME,
  });
  const navigate = useNavigate();

  const { userPermissions = [] } = useContentGuard();
  const user = useAuthStore().user;

  console.log('userPermissions', userPermissions);

  return (
    <Dropdown
      actions={getVendorOptions({
        modal,
        vendor: row.original as any,
        option: {
          hasView: true,
          hasDeactivate: true,
          hasActivate: true,
          hasDelete: true,
        },
        loginUser: user!,
        userPermissions,
        navigate,
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
