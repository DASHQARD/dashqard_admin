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
import React from 'react';

export function useVendorManagementBase() {
  const { state } = useSearch();
  const params = useParams();

  const [query, setQuery] = useReducerSpread(DEFAULT_QUERY);
  const { userPermissions = [] } = useContentGuard();

  const user = useAuthStore().user;

  React.useEffect(() => {
    if (state?.searchQuery) {
      setQuery({ ...query, page: 1, search: state.searchQuery.trim() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setQuery, state?.searchQuery]);

  const { useGetVendors } = vendorManagementQueries();
  const { data, isLoading: isLoadingVendorsList } = useGetVendors();

  console.log('data inside', data);
  const { data: vendorDetails, isLoading: isLoadingVendorDetails } =
    useVendorDetails(params?.vendorId || '');
  const vendorsList = data || [];

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
        value: details.approval_status || '-',
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
  }) {
    console.log('vendor stuff check', vendor);
    if (!vendor) return [];

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
            MODALS.VENDOR_MANAGEMENT.CHILDREN.VIEW,
            vendor
          ),
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

    // Activate option
    if (
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

    // Deactivate option
    if (
      option?.hasDeactivate &&
      (permissionsToCheck.some(
        (p) =>
          p.toLowerCase().includes('vendors:manage') ||
          p.toLowerCase().includes('vendor management deactivate/activate')
      ) ||
        userToCheck?.isSuperAdmin)
    ) {
      actions.push({
        label: 'Deactivate',
        onClickFn: () =>
          modalInstance.openModal(
            MODALS.VENDOR_MANAGEMENT.CHILDREN.DEACTIVATE,
            vendor
          ),
      });
    }

    // Approve option
    if (
      permissionsToCheck.some(
        (p) =>
          p.toLowerCase().includes('vendors:manage') ||
          p.toLowerCase().includes('vendor management approve')
      ) ||
      userToCheck?.isSuperAdmin
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

  return {
    query,
    vendorsList,
    getVendorOptions,
    vendorInfo,
    vendorDetails,
    isLoadingVendorsList,
    isLoadingVendorDetails,
    setQuery,
  };
}
