import { Dropdown } from '@/components';
import { useCorporateManagementBase } from '@/features/hooks/corporateManagement';
import { useContentGuard, usePersistedModalState } from '@/hooks';
import { Icon } from '@/libs';
import { useAuthStore } from '@/stores';
import type { TableCellProps } from '@/types/shared';
import { MODALS } from '@/utils';
import { useNavigate } from 'react-router';

export function CorporateActionCell({ row }: TableCellProps<{ id: string }>) {
  const navigate = useNavigate();
  const { getCorporateOptions } = useCorporateManagementBase();
  const modal = usePersistedModalState({
    paramName: MODALS.CORPORATE_MANAGEMENT.PARAM_NAME,
  });

  const { userPermissions = [] } = useContentGuard();
  const user = useAuthStore().user;

  return (
    <Dropdown
      actions={getCorporateOptions({
        modal,
        corporate: row.original as any,
        option: {
          hasView: true,
          hasDeactivate: true,
          hasActivate: true,
          hasUpdate: true,
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
