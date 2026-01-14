import {
  useContentGuard,
  usePersistedModalState,
  useReducerSpread,
} from '@/hooks';
import { DEFAULT_QUERY, MODALS } from '@/utils';
import { vendorPaymentsManagementQueries } from './vendorPaymentsQueries';
import { useAuthStore } from '@/stores';

export function useVendorPaymentsManagementBase() {
  const [query, setQuery] = useReducerSpread(DEFAULT_QUERY);

  const { useGetVendorPayments, useGetVendorPaymentsSummary } =
    vendorPaymentsManagementQueries();
  const { userPermissions = [] } = useContentGuard();
  const user = useAuthStore().user;
  const { data: vendorPaymentList, isLoading: isLoadingVendorPayments } =
    useGetVendorPayments();

  const { data: summaryData, isLoading: isLoadingSummary } =
    useGetVendorPaymentsSummary();

  const vendorInfo = [
    {
      label: 'Vendor Name',
      value: vendorPaymentList?.vendor_name || '-',
    },
    {
      label: 'Vendor ID',
      value: vendorPaymentList?.vendor_id || '-',
    },
    {
      label: 'Vendor GVID',
      value: vendorPaymentList?.vendor_gvid || '-',
    },
    {
      label: 'Branch Location',
      value: vendorPaymentList?.branch_location || '-',
    },
    {
      label: 'Created At',
      value: vendorPaymentList?.created_at || '-',
    },
    {
      label: 'Updated At',
      value: vendorPaymentList?.updated_at || '-',
    },
    {
      label: 'Description',
      value: vendorPaymentList?.description || '-',
    },
    {
      label: 'Due Date',
      value: vendorPaymentList?.due_date || '-',
    },
    {
      label: 'Paid Date',
      value: vendorPaymentList?.paid_date || '-',
    },
    {
      label: 'Payment Amount',
      value: vendorPaymentList?.payment_amount || '-',
    },
    {
      label: 'Payment Frequency',
      value: vendorPaymentList?.payment_frequency || '-',
    },
    {
      label: 'Payment Period',
      value: vendorPaymentList?.payment_period || '-',
    },
    {
      label: 'Status',
      value: vendorPaymentList?.status || '-',
    },
    {
      label: 'Transaction Reference',
      value: vendorPaymentList?.transaction_reference || '-',
    },
    {
      label: 'Notes',
      value: vendorPaymentList?.notes || '-',
    },
  ];

  function getVendorPaymentOptions({
    modal: modalInstance,
    vendorPayment: vendorPaymentData,
    option,
    loginUser,
    userPermissions: providedPermissions,
  }: {
    modal: ReturnType<typeof usePersistedModalState>;
    vendorPayment: any;
    option: {
      hasView?: boolean;
      hasUpdate?: boolean;
      hasDelete?: boolean;
      hasActivate?: boolean;
      hasDeactivate?: boolean;
      hasProcess?: boolean;
      hasDownloadInvoice?: boolean;
      hasUpdatePreferences?: boolean;
    };
    loginUser: any;
    userPermissions: string[];
  }) {
    if (!vendorPaymentData) return [];

    const actions = [];
    const permissionsToCheck = providedPermissions || userPermissions;
    const userToCheck = loginUser || user;

    if (
      option?.hasView &&
      (permissionsToCheck.some(
        (p) =>
          p.toLowerCase().includes('vendor_payments:get') ||
          p.toLowerCase().includes('vendor payments management view')
      ) ||
        userToCheck?.isSuperAdmin)
    ) {
      actions.push({
        label: 'View Details',
        onClickFn: () =>
          modalInstance.openModal(
            MODALS.VENDOR_PAYMENT_MANAGEMENT.CHILDREN.VIEW,
            vendorPaymentData
          ),
      });
    }
    if (
      option?.hasUpdate &&
      (permissionsToCheck.some(
        (p) =>
          p.toLowerCase().includes('vendor_payments:update_status') ||
          p.toLowerCase().includes('vendor payments management update')
      ) ||
        userToCheck?.isSuperAdmin)
    ) {
      actions.push({
        label: 'Update Payment',
        onClickFn: () =>
          modalInstance.openModal(
            MODALS.VENDOR_PAYMENT_MANAGEMENT.CHILDREN.UPDATE,
            vendorPaymentData
          ),
      });
    }

    if (
      option?.hasDelete &&
      (permissionsToCheck.some(
        (p) =>
          p.toLowerCase().includes('vendor_payments:delete') ||
          p.toLowerCase().includes('vendor payments management delete')
      ) ||
        userToCheck?.isSuperAdmin)
    ) {
      actions.push({
        label: 'Delete Payment',
        onClickFn: () =>
          modalInstance.openModal(
            MODALS.VENDOR_PAYMENT_MANAGEMENT.CHILDREN.DELETE,
            vendorPaymentData
          ),
      });
    }

    if (
      option?.hasProcess &&
      (permissionsToCheck.some(
        (p) =>
          p.toLowerCase().includes('vendor_payments:process') ||
          p.toLowerCase().includes('vendor payments management process')
      ) ||
        userToCheck?.isSuperAdmin)
    ) {
      actions.push({
        label: 'Process Payment',
        onClickFn: () =>
          modalInstance.openModal(
            MODALS.VENDOR_PAYMENT_MANAGEMENT.CHILDREN.CREATE,
            vendorPaymentData
          ),
      });
    }

    if (
      option?.hasDownloadInvoice &&
      (permissionsToCheck.some(
        (p) =>
          p.toLowerCase().includes('vendor_payments:create') ||
          p
            .toLowerCase()
            .includes('vendor payments management download invoice')
      ) ||
        userToCheck?.isSuperAdmin)
    ) {
      actions.push({
        label: 'Download Invoice',
        onClickFn: () =>
          modalInstance.openModal(
            MODALS.VENDOR_PAYMENT_MANAGEMENT.CHILDREN.DOWNLOAD_INVOICE,
            vendorPaymentData
          ),
      });
    }

    if (
      option?.hasUpdatePreferences &&
      (permissionsToCheck.some(
        (p) =>
          p.toLowerCase().includes('vendor_payments:update_preferences') ||
          p
            .toLowerCase()
            .includes('vendor payments management update preferences')
      ) ||
        userToCheck?.isSuperAdmin)
    ) {
      actions.push({
        label: 'Update Payment Preferences',
        onClickFn: () =>
          modalInstance.openModal(
            MODALS.VENDOR_PAYMENT_MANAGEMENT.CHILDREN.PREFERENCES,
            vendorPaymentData
          ),
      });
    }
    return actions;
  }

  return {
    query,
    setQuery,
    vendorPaymentList,
    isLoadingVendorPayments,
    isLoadingSummary,
    summaryData,
    getVendorPaymentOptions,
    vendorInfo,
  };
}
