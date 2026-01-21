import { useContentGuard, useReducerSpread } from '@/hooks';

import { DEFAULT_QUERY, MODALS } from '@/utils';

import { requestManagementQueries } from './requestsQueries';
import { useSearch } from '@/hooks/useSearch';
import { useAuthStore } from '@/stores';
import React, { useCallback, useMemo } from 'react';
import { usePersistedModalState } from '@/hooks';

export function useRequestManagementBase() {
  const { state } = useSearch();

  const [query, setQuery] = useReducerSpread(DEFAULT_QUERY);
  const { userPermissions = [] } = useContentGuard();

  const user = useAuthStore().user;

  React.useEffect(() => {
    if (state?.searchQuery) {
      setQuery({ ...query, search: state.searchQuery.trim() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setQuery, state?.searchQuery]);

  const { useGetRequestCorporates } = requestManagementQueries();

  const paramsForApi = useMemo(() => {
    const apiParams: any = {
      limit: query.limit || 10,
    }
    const queryWithAfter = query as any;
    if (queryWithAfter.after) {
      // Send after as date string (API expects date string format)
      apiParams.after = queryWithAfter.after;
    }
    if (query.search) {
      apiParams.search = query.search
    }
    if (query.status) {
      apiParams.status = query.status
    }
    return apiParams
  }, [query])

  const {
    data: allRequestsResponse,
    isLoading: isLoadingRequestCorporatesList,
  } = useGetRequestCorporates(paramsForApi);

  // Extract data from response
  const allRequestsList = React.useMemo(() => {
    if (!allRequestsResponse) return null;
    // Response is the full object with data array and pagination info
    if (Array.isArray(allRequestsResponse)) {
      return allRequestsResponse;
    }
    return allRequestsResponse.data || [];
  }, [allRequestsResponse]);

  const pagination = React.useMemo(() => {
    if (!allRequestsResponse || Array.isArray(allRequestsResponse)) {
      return {
        hasNextPage: false,
        hasPreviousPage: false,
        next: null,
        previous: null,
      };
    }
    return {
      hasNextPage: allRequestsResponse.pagination?.hasNextPage ?? false,
      hasPreviousPage: allRequestsResponse.pagination?.hasPreviousPage ?? false,
      next: allRequestsResponse.pagination?.next ?? null,
      previous: allRequestsResponse.pagination?.previous ?? null,
    };
  }, [allRequestsResponse]);

  // Filter corporate requests (user_type includes "corporate")
  const requestCorporatesList = React.useMemo(() => {
    if (!allRequestsList || !Array.isArray(allRequestsList)) return [];
    return allRequestsList.filter((request: any) =>
      request.user_type?.toLowerCase().includes('corporate')
    );
  }, [allRequestsList]);

  // Filter vendor requests (user_type === "vendor")
  const requestVendorsList = React.useMemo(() => {
    if (!allRequestsList || !Array.isArray(allRequestsList)) return [];
    return allRequestsList.filter(
      (request: any) => request.user_type?.toLowerCase() === 'vendor'
    );
  }, [allRequestsList]);

  function getRequestCorporateOptions({
    modal: modalInstance,
    requestCorporate,
    option,
    loginUser,
    userPermissions: providedPermissions,
  }: {
    modal: ReturnType<typeof usePersistedModalState>;
    requestCorporate: any;
    option: {
      hasView?: boolean;
      hasApprove?: boolean;
      hasReject?: boolean;
      hasDelete?: boolean;
    };
    loginUser: any;
    userPermissions: string[];
  }) {
    if (!requestCorporate) return [];

    const actions = [];
    const permissionsToCheck = providedPermissions || userPermissions;
    const userToCheck = loginUser || user;

    // View option
    if (
      option?.hasView &&
      (permissionsToCheck.some(
        (p) =>
          p.toLowerCase().includes('corporates:view') ||
          p.toLowerCase().includes('corporate management view')
      ) ||
        userToCheck?.isSuperAdmin)
    ) {
      actions.push({
        label: 'View',
        onClickFn: () =>
          modalInstance.openModal(
            MODALS.REQUEST_CORPORATE_MANAGEMENT.CHILDREN.VIEW,
            requestCorporate
          ),
      });
    }

    // Approve option - only show if status is not already approved
    if (
      option?.hasApprove &&
      requestCorporate.status?.toLowerCase() !== 'approved' &&
      (permissionsToCheck.some(
        (p) =>
          p.toLowerCase().includes('corporates:manage') ||
          p.toLowerCase().includes('corporate management deactivate/activate')
      ) ||
        userToCheck?.isSuperAdmin)
    ) {
      actions.push({
        label: 'Approve Request',
        onClickFn: () => {
          modalInstance.openModal(
            MODALS.REQUEST_CORPORATE_MANAGEMENT.CHILDREN.APPROVE,
            {
              id: String(requestCorporate.id),
              status: 'approved',
            }
          );
        },
      });
    }

    // Reject option - only show if status is not already rejected
    if (
      option?.hasReject &&
      requestCorporate.status?.toLowerCase() !== 'rejected' &&
      (permissionsToCheck.some(
        (p) =>
          p.toLowerCase().includes('corporates:manage') ||
          p.toLowerCase().includes('corporate management deactivate/activate')
      ) ||
        userToCheck?.isSuperAdmin)
    ) {
      actions.push({
        label: 'Reject Request',
        onClickFn: () =>
          modalInstance.openModal(
            MODALS.REQUEST_CORPORATE_MANAGEMENT.CHILDREN.REJECT,
            {
              id: String(requestCorporate.id),
              status: 'rejected',
            }
          ),
      });
    }

    // Delete option
    if (
      option?.hasDelete &&
      (permissionsToCheck.some(
        (p) =>
          p.toLowerCase().includes('corporates:manage') ||
          p.toLowerCase().includes('requests:delete') ||
          p.toLowerCase().includes('corporate management')
      ) ||
        userToCheck?.isSuperAdmin)
    ) {
      actions.push({
        label: 'Delete Request',
        icon: 'bi:trash',
        className: 'text-error',
        onClickFn: () =>
          modalInstance.openModal(
            MODALS.REQUEST_CORPORATE_MANAGEMENT.CHILDREN.DELETE,
            requestCorporate
          ),
      });
    }

    return actions;
  }

  function getRequestVendorOptions({
    modal: modalInstance,
    requestVendor,
    option,
    loginUser,
    userPermissions: providedPermissions,
  }: {
    modal: ReturnType<typeof usePersistedModalState>;
    requestVendor: any;
    option: {
      hasView?: boolean;
      hasApprove?: boolean;
      hasReject?: boolean;
      hasDelete?: boolean;
    };
    loginUser: any;
    userPermissions: string[];
  }) {
    if (!requestVendor) return [];

    const actions = [];
    const permissionsToCheck = providedPermissions || userPermissions;
    const userToCheck = loginUser || user;

    // View option
    if (
      option?.hasView &&
      (permissionsToCheck.some(
        (p) =>
          p.toLowerCase().includes('vendors:view') ||
          p.toLowerCase().includes('vendor management view')
      ) ||
        userToCheck?.isSuperAdmin)
    ) {
      actions.push({
        label: 'View',
        onClickFn: () =>
          modalInstance.openModal(
            MODALS.REQUEST_VENDOR_MANAGEMENT.CHILDREN.VIEW,
            requestVendor
          ),
      });
    }

    // Approve option - only show if status is not already approved
    if (
      option?.hasApprove &&
      requestVendor.status?.toLowerCase() !== 'approved' &&
      (permissionsToCheck.some(
        (p) =>
          p.toLowerCase().includes('vendors:manage') ||
          p.toLowerCase().includes('vendor management deactivate/activate')
      ) ||
        userToCheck?.isSuperAdmin)
    ) {
      actions.push({
        label: 'Approve Request',
        onClickFn: () => {
          modalInstance.openModal(MODALS.REQUEST_VENDOR_MANAGEMENT.CHILDREN.APPROVE, {
            id: String(requestVendor.id),
            status: 'approved',
          });
        },
      });
    }

    // Reject option - only show if status is not already rejected
    if (
      option?.hasReject &&
      requestVendor.status?.toLowerCase() !== 'rejected' &&
      (permissionsToCheck.some(
        (p) =>
          p.toLowerCase().includes('vendors:manage') ||
          p.toLowerCase().includes('vendor management deactivate/activate')
      ) ||
        userToCheck?.isSuperAdmin)
    ) {
      actions.push({
        label: 'Reject Request',
        onClickFn: () =>
          modalInstance.openModal(MODALS.REQUEST_VENDOR_MANAGEMENT.CHILDREN.REJECT, {
            id: String(requestVendor.id),
            status: 'rejected',
          }),
      });
    }

    // Delete option
    if (
      option?.hasDelete &&
      (permissionsToCheck.some(
        (p) =>
          p.toLowerCase().includes('vendors:manage') ||
          p.toLowerCase().includes('requests:delete') ||
          p.toLowerCase().includes('vendor management')
      ) ||
        userToCheck?.isSuperAdmin)
    ) {
      actions.push({
        label: 'Delete Request',
        icon: 'bi:trash',
        className: 'text-error',
        onClickFn: () =>
          modalInstance.openModal(
            MODALS.REQUEST_VENDOR_MANAGEMENT.CHILDREN.DELETE,
            requestVendor
          ),
      });
    }

    return actions;
  }

  const handleNextPage = useCallback(() => {
    if (pagination?.hasNextPage && pagination?.next) {
      // Set after as date string (API expects date string format)
      setQuery({ ...query, after: pagination.next } as any)
    }
  }, [pagination, query, setQuery])

  const handleSetAfter = useCallback(
    (after: string) => {
      // Set after as date string or empty string to reset
      setQuery({ ...query, after: after || undefined } as any)
    },
    [query, setQuery],
  )

  // Calculate estimated total for display
  const estimatedTotal = useMemo(() => {
    const totalLength = (requestCorporatesList?.length || 0) + (requestVendorsList?.length || 0);
    return pagination?.hasNextPage
      ? totalLength + (query.limit || 10)
      : totalLength
  }, [pagination, requestCorporatesList?.length, requestVendorsList?.length, query.limit])

  return {
    query,
    requestCorporatesList,
    requestVendorsList,
    getRequestCorporateOptions,
    getRequestVendorOptions,
    isLoadingRequestCorporatesList,
    setQuery,
    pagination,
    handleNextPage,
    handleSetAfter,
    estimatedTotal,
  };
}
