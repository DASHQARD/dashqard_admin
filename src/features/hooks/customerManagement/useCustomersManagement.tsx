import React from 'react';

import {
  useContentGuard,
  usePersistedModalState,
  useReducerSpread,
  useSearch,
} from '../../../hooks';
import { useAuthStore } from '../../../stores';
import { DEFAULT_QUERY, MODALS } from '../../../utils/constants';
import { CustomerStuff } from '../../components/customerManagement';
import { useCustomers } from './useCustomers';

export function useCustomersManagementBase() {
  const { state } = useSearch();

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
      setQuery({ ...query, after: '', search: state.searchQuery.trim() });
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
    const baseOptions: { label: string; onClickFn: () => void }[] = [];

    const viewOption = [
      {
        label: 'View',
        onClickFn: () => modal.openModal(MODALS.CUSTOMER.VIEW, ajo),
      },
    ];

    const editOption = {
      label: 'Edit',
      onClickFn: () => modal.openModal(MODALS.CUSTOMER.VIEW, ajo),
    };

    const activateOption = {
      label: 'Activate',
      onClickFn: () => modal.openModal(MODALS.CUSTOMER.ACTIVATE, ajo),
    };

    const deactivateOption = {
      label: 'Deactivate',
      onClickFn: () => modal.openModal(MODALS.CUSTOMER.DEACTIVATE, ajo),
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
    setQuery,
    getSavingsOptions,
    customers: customers?.data ?? [],
    isLoadingCustomers,
  };
}
