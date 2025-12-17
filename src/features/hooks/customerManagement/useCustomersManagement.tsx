import React from 'react';
import { useNavigate } from 'react-router';

import {
  useContentGuard,
  usePersistedModalState,
  useReducerSpread,
  // useSearch,
} from '@/hooks';
import { useAuthStore } from '@/stores';
import { DEFAULT_QUERY, MODALS, ROUTES } from '@/utils/constants';
import { useCustomers } from './useCustomers';
import { CustomerStuff } from '@/features/components/customerManagement';

export function useCustomersManagementBase(dateRange?: string) {
  const { state } = useSearch();
  const navigate = useNavigate();

  const [query, setQuery] = useReducerSpread(DEFAULT_QUERY);
  const { userPermissions = [] } = useContentGuard();

  const user = useAuthStore().user;

  const modal = usePersistedModalState({
    paramName: MODALS.CUSTOMER.ROOT,
  });

  const { data: customers, isLoading: isLoadingCustomers } = useCustomers({
    ...query,
  });

  React.useEffect(() => {
    if (state) {
      setQuery({ ...query, page: 1, search: state.searchQuery.trim() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setQuery, state.searchQuery]);

  const tabConfigs = [
    {
      key: 'customers' as const,
      component: () => <CustomerStuff />,
      label: 'Customers',
    },
  ];

  function getSavingsOptions(
    ajo: any,
    option: {
      hasView?: boolean;
      hasUpdate?: boolean;
      hasDelete?: boolean;
      hasActivate?: boolean;
      hasDeactivate?: boolean;
    }
  ) {
    if (!ajo) return [];
    const baseOptions = [];

    const viewOption = [
      {
        label: 'View',
        onClickFn: () =>
          navigate(
            `${ROUTES.IN_APP.DASHBOARD.SAVINGS.SAVINGS_DETAILS}/participants/${ajo.id}?type=ajo&groupName=${encodeURIComponent(ajo.group_name || '')}`
          ),
      },
    ];

    const editOption = {
      label: 'Edit',
      onClickFn: () => modal.openModal(MODALS.SAVINGS.CHILDREN.UPDATE, ajo),
    };

    const activateOption = {
      label: 'Activate',
      onClickFn: () => modal.openModal(MODALS.SAVINGS.CHILDREN.ACTIVATE, ajo),
    };

    const deactivateOption = {
      label: 'Deactivate',
      onClickFn: () => modal.openModal(MODALS.SAVINGS.CHILDREN.DEACTIVATE, ajo),
    };

    if (
      option?.hasView &&
      (userPermissions.includes('Savings management view') ||
        user?.isSuperAdmin)
    ) {
      baseOptions.push(...viewOption);
    }

    if (
      option?.hasUpdate &&
      (userPermissions.includes('Savings management edit') ||
        user?.isSuperAdmin)
    ) {
      baseOptions.push(editOption);
    }
    if (
      option?.hasActivate &&
      (userPermissions.includes('Savings management deactivate/activate') ||
        user?.isSuperAdmin)
    ) {
      baseOptions.push(activateOption);
    }
    if (
      option?.hasDeactivate &&
      (userPermissions.includes('Savings management deactivate/activate') ||
        user?.isSuperAdmin)
    ) {
      baseOptions.push(deactivateOption);
    }
    return baseOptions;
  }

  return {
    modal,
    query,
    tabConfigs,
    // ajoList,
    // isLoadingAjoList,
    // InterestRateSettingsTabConfigs,
    setQuery,
    getSavingsOptions,
    // ajoTotal,
    // isLoadingAjoTotal,
  };
}
