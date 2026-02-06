import {
  useContentGuard,
  usePersistedModalState,
  useReducerSpread,
} from '@/hooks';

import { DEFAULT_QUERY, formatDate, MODALS } from '@/utils';

import { vendorManagementQueries } from './vendorQueries';
import { useVendorDetails } from '../useVendorDetails';
import { useParams } from 'react-router';
import { useSearch } from '@/hooks/useSearch';
import { useAuthStore } from '@/stores';
import React, { useCallback, useMemo } from 'react';

export function useVendorManagementBase() {
  const { state } = useSearch();
  const params = useParams();

  const [query, setQuery] = useReducerSpread(DEFAULT_QUERY);
  const { userPermissions = [] } = useContentGuard();

  const user = useAuthStore().user;

  React.useEffect(() => {
    if (state?.searchQuery) {
      setQuery({ ...query, search: state.searchQuery.trim() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setQuery, state?.searchQuery]);

  const { useGetVendors } = vendorManagementQueries();

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

  const { data, isLoading: isLoadingVendorsList } = useGetVendors(paramsForApi);

  const { data: vendorDetails, isLoading: isLoadingVendorDetails } =
    useVendorDetails(params?.vendorId || '');

  const vendorsList = React.useMemo(() => {
    if (!data?.data) return [];
    return data.data.filter((vendor: any) =>
      vendor.vendor_user_type?.toLowerCase().includes('vendor')
    );
  }, [data]);

  const pagination = data?.pagination;

  console.log('vendorDetails inside', vendorsList);
  const vendorInfo = React.useMemo(() => {
    if (!vendorDetails) return [];

    const details = vendorDetails;

    return [
      {
        label: 'Vendor Name',
        value: details.fullname || '-',
      },
      {
        label: 'Email',
        value: details.email || '-',
      },
      {
        label: 'Phone Number',
        value: details.phonenumber || '-',
      },
      {
        label: 'Vendor User Type',
        value: details.user_type || '-',
      },
      {
        label: 'Vendor Status',
        value: (details as any).approval_status || details.status || '-',
      },
      {
        label: 'Vendor ID',
        value: details.id || '-',
      },
      {
        label: 'Date Created',
        value: details.created_at
          ? formatDate(details.created_at, 'DD MMM YYYY')
          : '-',
      },
    ];
  }, [vendorDetails]);

  function getVendorOptions({
    modal: modalInstance,
    vendor,
    option,
    loginUser,
    userPermissions: providedPermissions,
    navigate: navigateFn,
  }: {
    modal: ReturnType<typeof usePersistedModalState>;
    vendor: any;
    option: {
      hasView?: boolean;
      hasUpdate?: boolean;
      hasActivate?: boolean;
      hasDeactivate?: boolean;
      hasDelete?: boolean;
    };
    loginUser: any;
    userPermissions: string[];
    navigate?: ReturnType<typeof import('react-router').useNavigate>;
  }) {
    console.log('vendor stuff check', vendor);
    if (!vendor) return [];

    const actions = [];
    const permissionsToCheck = providedPermissions || userPermissions;
    const userToCheck = loginUser || user;

    // View option - navigate to vendor details page
    if (
      option?.hasView &&
      (permissionsToCheck.some(
        (p) =>
          p.toLowerCase().includes('vendors:view') ||
          p.toLowerCase().includes('vendor management view')
      ) ||
        userToCheck?.isSuperAdmin)
    ) {
      const vendorId =
        vendor.vendor_account_id || vendor.vendor_id || vendor.id || '';
      actions.push({
        label: 'View',
        onClickFn: () => {
          if (navigateFn) {
            navigateFn(`/admin/vendors/${vendorId}`);
          } else {
            modalInstance.openModal(
              MODALS.VENDOR_MANAGEMENT.CHILDREN.VIEW,
              vendor
            );
          }
        },
      });
    }

    // Edit option
    if (
      option?.hasUpdate &&
      (permissionsToCheck.some(
        (p) =>
          p.toLowerCase().includes('vendors:manage') ||
          p.toLowerCase().includes('vendor management edit')
      ) ||
        userToCheck?.isSuperAdmin)
    ) {
      actions.push({
        label: 'Edit',
        onClickFn: () =>
          modalInstance.openModal(
            MODALS.VENDOR_MANAGEMENT.CHILDREN.EDIT,
            vendor
          ),
      });
    }

    // Use vendor_status first (matches "Vendor Status" column in table); fallback to status/approval_status
    const vendorStatus =
      vendor.vendor_status || vendor.status || vendor.approval_status || '';
    const statusLower = vendorStatus?.toLowerCase() || '';
    const isVendorActive =
      statusLower === 'active' ||
      statusLower === 'approved' ||
      statusLower === 'verified';
    const isVendorInactive =
      statusLower === 'inactive' ||
      statusLower === 'rejected' ||
      statusLower === 'pending';

    // Activate option - only show if vendor is NOT active
    if (
      !isVendorActive &&
      option?.hasActivate &&
      (permissionsToCheck.some(
        (p) =>
          p.toLowerCase().includes('vendors:manage') ||
          p.toLowerCase().includes('vendor management deactivate/activate')
      ) ||
        userToCheck?.isSuperAdmin)
    ) {
      actions.push({
        label: 'Activate',
        onClickFn: () =>
          modalInstance.openModal(
            MODALS.VENDOR_MANAGEMENT.CHILDREN.ACTIVATE,
            vendor
          ),
      });
    }

    // Deactivate option - only show if vendor IS verified/active
    if (
      isVendorActive &&
      option?.hasDeactivate &&
      (permissionsToCheck.some(
        (p) =>
          p.toLowerCase().includes('vendors:manage') ||
          p.toLowerCase().includes('vendor management deactivate/activate')
      ) ||
        userToCheck?.isSuperAdmin)
    ) {
      actions.push({
        label: 'Reject vendor',
        onClickFn: () =>
          modalInstance.openModal(
            MODALS.VENDOR_MANAGEMENT.CHILDREN.DEACTIVATE,
            vendor
          ),
      });
    }

    // Approve option - only show if vendor is inactive/rejected/pending (never for verified/active)
    if (
      isVendorInactive &&
      (permissionsToCheck.some(
        (p) =>
          p.toLowerCase().includes('vendors:manage') ||
          p.toLowerCase().includes('vendor management approve')
      ) ||
        userToCheck?.isSuperAdmin)
    ) {
      actions.push({
        label: 'Approve',
        onClickFn: () =>
          modalInstance.openModal(
            MODALS.VENDOR_MANAGEMENT.CHILDREN.APPROVE,
            vendor
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
    return pagination?.hasNextPage
      ? vendorsList.length + (query.limit || 10)
      : vendorsList.length
  }, [pagination, vendorsList.length, query.limit])

  return {
    query,
    vendorsList,
    getVendorOptions,
    vendorInfo,
    vendorDetails,
    isLoadingVendorsList,
    isLoadingVendorDetails,
    setQuery,
    pagination,
    handleNextPage,
    handleSetAfter,
    estimatedTotal,
  };
}
