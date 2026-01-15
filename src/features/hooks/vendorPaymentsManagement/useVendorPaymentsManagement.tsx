import {
  useContentGuard,
  usePersistedModalState,
  useReducerSpread,
} from '@/hooks';
import { DEFAULT_QUERY, MODALS } from '@/utils';
import { vendorPaymentsManagementQueries } from './vendorPaymentsQueries';
import { useAuthStore } from '@/stores';
import React from 'react';

export function useVendorPaymentsManagementBase() {
  const [query, setQuery] = useReducerSpread(DEFAULT_QUERY);
  const [cursorHistory, setCursorHistory] = React.useState<string[]>([]);
  const latestNextCursor = React.useRef<string | null>(null);

  const { useGetVendorPayments, useGetVendorPaymentsSummary } =
    vendorPaymentsManagementQueries();
  const { userPermissions = [] } = useContentGuard();
  const user = useAuthStore().user;

  // Map query to API format (convert page to after cursor)
  const apiQuery = React.useMemo(() => {
    const { page, limit, search, ...rest } = query as any;
    const apiParams: any = {
      limit: limit || 10,
      ...(search && { search }),
      ...rest,
    };

    // For cursor pagination, use 'after' from cursor history
    // cursorHistory stores the 'next' cursor for each page
    const currentPage = page || 1;
    if (currentPage > 1 && cursorHistory[currentPage - 2]) {
      apiParams.after = cursorHistory[currentPage - 2];
    }

    return apiParams;
  }, [query, cursorHistory]);

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
    const next = vendorPaymentsResponse.next ?? null;
    // Store the latest next cursor in ref for use in handleNextPage
    latestNextCursor.current = next;
    return {
      hasNextPage: vendorPaymentsResponse.hasNextPage ?? false,
      hasPreviousPage: vendorPaymentsResponse.hasPreviousPage ?? false,
      next,
      previous: vendorPaymentsResponse.previous ?? null,
    };
  }, [vendorPaymentsResponse]);

  // Handle next page
  const handleNextPage = React.useCallback(() => {
    const currentNextCursor = latestNextCursor.current;
    const currentPage = (query as any).page || 1;
    
    if (!currentNextCursor) {
      console.warn('No next cursor available');
      return;
    }

    console.log('Navigating to next page:', {
      currentPage,
      nextCursor: currentNextCursor,
    });

    // Store the 'next' cursor for the current page (this will be used as 'after' for next page)
    setCursorHistory((prevHistory) => {
      const newHistory = [...prevHistory];
      // Pad array if needed
      while (newHistory.length < currentPage) {
        newHistory.push('');
      }
      newHistory[currentPage - 1] = currentNextCursor;
      console.log('Updated cursor history:', newHistory);
      return newHistory;
    });
    
    // Update query with new page number
    const newPage = currentPage + 1;
    console.log('Setting page to:', newPage);
    setQuery({ ...query, page: newPage } as any);
  }, [query, setQuery]);

  // Handle previous page
  const handlePreviousPage = React.useCallback(() => {
    const currentPage = (query as any).page || 1;
    if (currentPage > 1) {
      setQuery({ ...query, page: currentPage - 1 } as any);
    }
  }, [query, setQuery]);

  // Reset cursor history when search or filters change
  const prevSearch = React.useRef(query.search);
  const prevStatus = React.useRef((query as any).VENDOR_PAYMENT_STATUS);
  const prevFrequency = React.useRef((query as any).VENDOR_PAYMENT_FREQUENCY);

  React.useEffect(() => {
    const searchChanged = prevSearch.current !== query.search;
    const statusChanged = prevStatus.current !== (query as any).VENDOR_PAYMENT_STATUS;
    const frequencyChanged = prevFrequency.current !== (query as any).VENDOR_PAYMENT_FREQUENCY;

    if (searchChanged || statusChanged || frequencyChanged) {
      setCursorHistory([]);
      latestNextCursor.current = null;
      setQuery({ ...query, page: 1 } as any);
      prevSearch.current = query.search;
      prevStatus.current = (query as any).VENDOR_PAYMENT_STATUS;
      prevFrequency.current = (query as any).VENDOR_PAYMENT_FREQUENCY;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.search, (query as any).VENDOR_PAYMENT_STATUS, (query as any).VENDOR_PAYMENT_FREQUENCY]);

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
    // Cursor pagination props
    paginationInfo,
    handleNextPage,
    handlePreviousPage,
  };
}
