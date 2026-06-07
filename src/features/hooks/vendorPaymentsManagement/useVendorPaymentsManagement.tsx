import {
  useContentGuard,
  usePersistedModalState,
  useReducerSpread,
} from '@/hooks';
import { DEFAULT_QUERY, MODALS } from '@/utils';
import { vendorPaymentsManagementQueries } from './vendorPaymentsQueries';
import { useAuthStore } from '@/stores';
import React, { useCallback, useMemo } from 'react';

export function useVendorPaymentsManagementBase() {
  const [query, setQuery] = useReducerSpread(DEFAULT_QUERY);

  const { useGetVendorPayments, useGetVendorPaymentsSummary } =
    vendorPaymentsManagementQueries();
  const { userPermissions = [] } = useContentGuard();
  const user = useAuthStore().user;

  // Build query params for API with cursor support
  const apiQuery = React.useMemo(() => {
    const apiParams: any = {
      limit: query.limit || 10,
    };
    const queryWithAfter = query as any;
    if (queryWithAfter.after) {
      // Send after as date string (API expects date string format)
      apiParams.after = queryWithAfter.after;
    }
    if (query.search) {
      apiParams.search = query.search;
    }
    // Handle filter fields
    const statusField =
      (query as any).status || (query as any).VENDOR_PAYMENT_STATUS;
    if (statusField) {
      apiParams.status = statusField;
    }
    const frequencyField =
      (query as any).payment_frequency ||
      (query as any).VENDOR_PAYMENT_FREQUENCY;
    if (frequencyField) {
      apiParams.payment_frequency = frequencyField;
    }
    const q = query as Record<string, unknown>;
    if (q.vendor_id != null && q.vendor_id !== '') {
      apiParams.vendor_id = Number(q.vendor_id);
    }
    if (q.vendor_user_id != null && q.vendor_user_id !== '') {
      apiParams.vendor_user_id = Number(q.vendor_user_id);
    }
    if (q.branch_id != null && q.branch_id !== '') {
      apiParams.branch_id = Number(q.branch_id);
    }
    if (q.branch_location) {
      apiParams.branch_location = String(q.branch_location);
    }
    if (q.payment_period) {
      apiParams.payment_period = String(q.payment_period);
    }
    if (q.date_from) {
      apiParams.date_from = String(q.date_from);
    }
    if (q.date_to) {
      apiParams.date_to = String(q.date_to);
    }
    return apiParams;
  }, [query]);

  const { data: vendorPaymentsResponse, isLoading: isLoadingVendorPayments } =
    useGetVendorPayments(apiQuery);

  // Extract data and pagination info from response
  // Response structure: { data: [...], hasNextPage, hasPreviousPage, next, previous, ... }
  const vendorPaymentList = React.useMemo(() => {
    if (!vendorPaymentsResponse) return null;
    // Response is the full object with data array and pagination info
    if (Array.isArray(vendorPaymentsResponse)) {
      return vendorPaymentsResponse;
    }
    // Extract the data array from the response object
    return vendorPaymentsResponse.data || [];
  }, [vendorPaymentsResponse]);

  const paginationInfo = React.useMemo(() => {
    if (!vendorPaymentsResponse) {
      return {
        hasNextPage: false,
        hasPreviousPage: false,
        next: null,
        previous: null,
      };
    }
    // If response is an array, no pagination info
    if (Array.isArray(vendorPaymentsResponse)) {
      return {
        hasNextPage: false,
        hasPreviousPage: false,
        next: null,
        previous: null,
      };
    }
    // Extract pagination info from response object
    // Pagination info is nested in the pagination property
    const pagination = vendorPaymentsResponse.pagination;
    return {
      hasNextPage: pagination?.hasNextPage ?? false,
      hasPreviousPage: pagination?.hasPreviousPage ?? false,
      next: pagination?.next ?? null,
      previous: pagination?.previous ?? null,
    };
  }, [vendorPaymentsResponse]);

  // Handle next page
  const handleNextPage = useCallback(() => {
    if (paginationInfo?.hasNextPage && paginationInfo?.next) {
      // Set after as date string (API expects date string format)
      setQuery({ ...query, after: paginationInfo.next } as any);
    }
  }, [paginationInfo, query, setQuery]);

  // Handle set after (for previous page)
  const handleSetAfter = useCallback(
    (after: string) => {
      // Set after as date string or empty string to reset
      setQuery({ ...query, after: after || undefined } as any);
    },
    [query, setQuery]
  );

  // Handle previous page
  const handlePreviousPage = useCallback(() => {
    // Handle previous page using handleSetAfter
    const queryWithAfter = query as any;
    if (queryWithAfter.after && paginationInfo?.previous) {
      handleSetAfter(paginationInfo.previous);
    } else {
      // Reset to first page
      handleSetAfter('');
    }
  }, [query, paginationInfo, handleSetAfter]);

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

  // Calculate estimated total for display
  const estimatedTotal = useMemo(() => {
    const paymentsArray = Array.isArray(vendorPaymentList)
      ? vendorPaymentList
      : [];
    return paginationInfo?.hasNextPage
      ? paymentsArray.length + (query.limit || 10)
      : paymentsArray.length;
  }, [paginationInfo, vendorPaymentList, query.limit]);

  return {
    query,
    setQuery,
    vendorPaymentList: Array.isArray(vendorPaymentList)
      ? vendorPaymentList
      : [],
    isLoadingVendorPayments,
    isLoadingSummary,
    summaryData,
    getVendorPaymentOptions,
    vendorInfo,
    // Cursor pagination props
    paginationInfo,
    handleNextPage,
    handlePreviousPage,
    handleSetAfter,
    estimatedTotal,
  };
}
