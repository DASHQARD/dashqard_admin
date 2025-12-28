import { useContentGuard, useReducerSpread } from '@/hooks';

import { DEFAULT_QUERY, MODALS } from '@/utils';

import { requestManagementQueries } from './requestsQueries';
import { useSearch } from '@/hooks/useSearch';
import { useAuthStore } from '@/stores';
import React from 'react';
import { usePersistedModalState } from '@/hooks';

export function useRequestManagementBase() {
  const { state } = useSearch();

  const [query, setQuery] = useReducerSpread(DEFAULT_QUERY);
  const { userPermissions = [] } = useContentGuard();

  const user = useAuthStore().user;

  React.useEffect(() => {
    if (state?.searchQuery) {
      setQuery({ ...query, page: 1, search: state.searchQuery.trim() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setQuery, state?.searchQuery]);

  const { useGetRequestCorporates } = requestManagementQueries();
  const {
    data: allRequestsList,
    isLoading: isLoadingRequestCorporatesList,
  } = useGetRequestCorporates();

  // Filter corporate requests (user_type includes "corporate")
  const requestCorporatesList = React.useMemo(() => {
    if (!allRequestsList || !Array.isArray(allRequestsList)) return [];
    let filtered = allRequestsList.filter((request: any) =>
      request.user_type?.toLowerCase().includes('corporate')
    );
    
    // Apply client-side search filtering
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      filtered = filtered.filter((request: any) => {
        return (
          request.name?.toLowerCase().includes(searchLower) ||
          request.request_id?.toLowerCase().includes(searchLower) ||
          request.type?.toLowerCase().includes(searchLower) ||
          request.description?.toLowerCase().includes(searchLower)
        );
      });
    }
    
    return filtered;
  }, [allRequestsList, query.search]);

  // Filter vendor requests (user_type === "vendor")
  const requestVendorsList = React.useMemo(() => {
    if (!allRequestsList || !Array.isArray(allRequestsList)) return [];
    let filtered = allRequestsList.filter(
      (request: any) => request.user_type?.toLowerCase() === 'vendor'
    );
    
    // Apply client-side search filtering
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      filtered = filtered.filter((request: any) => {
        return (
          request.name?.toLowerCase().includes(searchLower) ||
          request.request_id?.toLowerCase().includes(searchLower) ||
          request.type?.toLowerCase().includes(searchLower) ||
          request.description?.toLowerCase().includes(searchLower)
        );
      });
    }
    
    return filtered;
  }, [allRequestsList, query.search]);

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

  return {
    query,
    requestCorporatesList,
    requestVendorsList,
    getRequestCorporateOptions,
    getRequestVendorOptions,
    isLoadingRequestCorporatesList,
    setQuery,
  };
}
