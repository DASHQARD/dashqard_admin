import { Dropdown } from '@/components';
import { useContentGuard, usePersistedModalState } from '@/hooks';
import { Icon } from '@/libs';
import type { TableCellProps } from '@/types/shared';
import { MODALS } from '@/utils';
import { useVendorPaymentsManagementBase } from '@/features/hooks/vendorPaymentsManagement/useVendorPaymentsManagement';
import { useAuthStore } from '@/stores';

export function VendorPaymentActionCell({
  row,
}: TableCellProps<{ id: string }>) {
  const modal = usePersistedModalState({
    paramName: MODALS.VENDOR_PAYMENT_MANAGEMENT.PARAM_NAME,
  });
  const { getVendorPaymentOptions } = useVendorPaymentsManagementBase();
  const { userPermissions = [] } = useContentGuard();
  const user = useAuthStore().user;

  return (
    <Dropdown
      actions={getVendorPaymentOptions({
        modal,
        vendorPayment: row.original as any,
        option: {
          hasView: true,
          hasUpdate: true,
          hasDelete: true,
          hasProcess: true,
          hasDownloadInvoice: true,
          hasUpdatePreferences: true,
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
