import { Tag } from '@/components';
import {
  useContentGuard,
  usePersistedModalState,
  useReducerSpread,
} from '@/hooks';

import {
  DEFAULT_QUERY,
  formatDate,
  getStatusVariant,
  MODALS,
  ROUTES,
} from '@/utils';

import { vendorManagementQueries } from './vendorQueries';
import { useNavigate } from 'react-router';
import { useSearch } from '@/hooks/useSearch';
import { useAuthStore } from '@/stores';
import React from 'react';

export function useVendorManagementBase() {
  const { state } = useSearch();
  const navigate = useNavigate();

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
  const { data: vendorsList, isLoading: isLoadingVendorsList } =
    useGetVendors();

  const modal = usePersistedModalState({
    paramName: MODALS.VENDOR_MANAGEMENT.ROOT,
  });

  const vendorInfo = [
    {
      label: 'Branch Name',
      value: vendorsList?.data[0]?.branch_name,
    },
    {
      label: 'Address',
      value: vendorsList?.data[0]?.business_address || '-',
    },
    {
      label: 'Date Joined',
      value: formatDate(vendorsList?.data[0]?.date_joined || ''),
    },
    {
      label: 'Last Login',
      value: '-',
    },
    {
      label: 'Phone number',
      value: vendorsList?.data[0]?.phone_number || '-',
    },
    {
      label: 'Wallet Status',
      value: (
        <Tag
          value={vendorsList?.data[0]?.wallet_active ? 'Active' : 'Frozen'}
          variant={getStatusVariant(
            vendorsList?.data[0]?.wallet_active ? 'active' : 'failed'
          )}
        />
      ),
    },
  ];

  function getVendorOptions(
    vendor: any,
    option: {
      hasView?: boolean;
      hasUpdate?: boolean;
      hasDelete?: boolean;
      hasActivate?: boolean;
      hasDeactivate?: boolean;
    }
  ) {
    if (!vendor) return [];
    const baseOptions = [];

    const viewOption = [
      {
        label: 'View',
        onClickFn: () =>
          navigate(
            `${ROUTES.IN_APP.DASHBOARD.VENDOR_DETAILS.replace(':vendorId', vendor.id)}`
          ),
      },
    ];

    const editOption = {
      label: 'Edit',
      onClickFn: () => modal.openModal(MODALS.VENDOR_MANAGEMENT.EDIT, vendor),
    };

    const activateOption = {
      label: 'Activate',
      onClickFn: () =>
        modal.openModal(MODALS.VENDOR_MANAGEMENT.ACTIVATE, vendor),
    };

    const deactivateOption = {
      label: 'Deactivate',
      onClickFn: () =>
        modal.openModal(MODALS.VENDOR_MANAGEMENT.DEACTIVATE, vendor),
    };

    if (
      option?.hasView &&
      (userPermissions.includes('Vendors management view') ||
        user?.isSuperAdmin)
    ) {
      baseOptions.push(...viewOption);
    }

    if (
      option?.hasUpdate &&
      (userPermissions.includes('Vendors management edit') ||
        user?.isSuperAdmin)
    ) {
      baseOptions.push(editOption);
    }
    if (
      option?.hasActivate &&
      (userPermissions.includes('Vendors management deactivate/activate') ||
        user?.isSuperAdmin)
    ) {
      baseOptions.push(activateOption);
    }
    if (
      option?.hasDeactivate &&
      (userPermissions.includes('Vendors management deactivate/activate') ||
        user?.isSuperAdmin)
    ) {
      baseOptions.push(deactivateOption);
    }
    return baseOptions;
  }

  return {
    query,
    vendorsList,
    getVendorOptions,
    vendorInfo,
    isLoadingVendorsList,
    setQuery,
  };
}
