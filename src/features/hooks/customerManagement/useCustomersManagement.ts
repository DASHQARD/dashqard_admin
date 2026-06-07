import {
  usePersistedModalState,
  useReducerSpread,
  // useSearch,
} from '@/hooks';
import { DEFAULT_QUERY, MODALS } from '@/utils/constants';
import { CustomerStuff } from '@/features/components/customerManagement';
import { useCustomers } from './useCustomers';
import type { Customer } from '@/types/customer';
import React, { useCallback, useMemo } from 'react';

export function useCustomersManagementBase() {
  // const { state } = useSearch();

  const [query, setQuery] = useReducerSpread(DEFAULT_QUERY);

  const modal = usePersistedModalState({
    paramName: MODALS.CUSTOMER.ROOT,
  });

  const paramsForApi = useMemo(() => {
    const apiParams: Record<string, string | number> = {
      limit: query.limit || 10,
    };
    const queryWithAfter = query as typeof query & { after?: string };
    if (queryWithAfter.after) {
      apiParams.after = queryWithAfter.after;
    }
    if (query.search) {
      apiParams.search = query.search;
    }
    if (query.status) {
      apiParams.status = query.status;
    }
    if (query.dateFrom) {
      apiParams.date_from = String(query.dateFrom);
    }
    if (query.dateTo) {
      apiParams.date_to = String(query.dateTo);
    }
    return apiParams;
  }, [query]);

  const { data: customersResponse, isLoading: isLoadingCustomers } =
    useCustomers(paramsForApi);

  const customers = React.useMemo(() => {
    if (!customersResponse) return null;
    // Response is the full object with data array and pagination info
    if (Array.isArray(customersResponse)) {
      return customersResponse;
    }
    return customersResponse.data || [];
  }, [customersResponse]);

  const pagination = React.useMemo(() => {
    if (!customersResponse || Array.isArray(customersResponse)) {
      return {
        hasNextPage: false,
        hasPreviousPage: false,
        next: null,
        previous: null,
      };
    }
    return {
      hasNextPage: customersResponse.pagination?.hasNextPage ?? false,
      hasPreviousPage: customersResponse.pagination?.hasPreviousPage ?? false,
      next: customersResponse.pagination?.next ?? null,
      previous: customersResponse.pagination?.previous ?? null,
    };
  }, [customersResponse]);

  // React.useEffect(() => {
  //   if (state) {
  //     setQuery({ ...query, page: 1, search: state.searchQuery.trim() });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [setQuery, state.searchQuery]);

  const tabConfigs = [
    {
      key: 'customers' as const,
      component: CustomerStuff,
      label: 'Customers',
    },
  ];

  function getCustomerOptions({
    modal: modalInstance,
    customer,
    option,
    userPermissions,
    loginUser,
  }: {
    modal: ReturnType<typeof usePersistedModalState>;
    customer: Customer;
    option: {
      hasView?: boolean;
      hasUpdate?: boolean;
      hasDelete?: boolean;
      hasActivate?: boolean;
      hasDeactivate?: boolean;
    };
    userPermissions: string[];
    loginUser: any;
  }) {
    if (!customer) return [];

    const actions = [];
    const permissionsToCheck = userPermissions || [];
    const userToCheck = loginUser;

    // Determine customer status
    const customerStatus = customer.status || '';
    const isCustomerActive =
      customerStatus?.toLowerCase() === 'active' ||
      customerStatus?.toLowerCase() === 'verified';

    // View option
    if (
      option?.hasView &&
      (permissionsToCheck.some(
        (p) =>
          p.toLowerCase().includes('users:view') ||
          p.toLowerCase().includes('customer') ||
          p.toLowerCase().includes('users:get')
      ) ||
        userToCheck?.isSuperAdmin)
    ) {
      actions.push({
        label: 'View',
        onClickFn: () =>
          modalInstance.openModal(MODALS.CUSTOMER.VIEW, customer),
      });
    }

    // Activate option - only show if customer is NOT active
    if (
      !isCustomerActive &&
      option?.hasActivate &&
      (permissionsToCheck.some(
        (p) =>
          p.toLowerCase().includes('users:manage') ||
          p.toLowerCase().includes('customer') ||
          p.toLowerCase().includes('users:update')
      ) ||
        userToCheck?.isSuperAdmin)
    ) {
      actions.push({
        label: 'Activate',
        onClickFn: () =>
          modalInstance.openModal(MODALS.CUSTOMER.ACTIVATE, customer),
      });
    }

    // Deactivate option - only show if customer IS active
    if (
      isCustomerActive &&
      option?.hasDeactivate &&
      (permissionsToCheck.some(
        (p) =>
          p.toLowerCase().includes('users:manage') ||
          p.toLowerCase().includes('customer') ||
          p.toLowerCase().includes('users:update')
      ) ||
        userToCheck?.isSuperAdmin)
    ) {
      actions.push({
        label: 'Deactivate',
        onClickFn: () =>
          modalInstance.openModal(MODALS.CUSTOMER.DEACTIVATE, customer),
      });
    }

    // Update Status option - general status management
    if (
      option?.hasUpdate &&
      (permissionsToCheck.some(
        (p) =>
          p.toLowerCase().includes('users:manage') ||
          p.toLowerCase().includes('customer') ||
          p.toLowerCase().includes('users:update')
      ) ||
        userToCheck?.isSuperAdmin)
    ) {
      actions.push({
        label: 'Update Status',
        onClickFn: () =>
          modalInstance.openModal(MODALS.CUSTOMER.DEACTIVATE, customer), // We can use DEACTIVATE as a generic status update
      });
    }

    return actions;
  }

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
        onClickFn: () => {},
      },
    ];

    const editOption = {
      label: 'Edit',
      onClickFn: () => {},
    };

    const activateOption = {
      label: 'Activate',
      onClickFn: () => {},
    };

    const deactivateOption = {
      label: 'Deactivate',
      onClickFn: () => {},
    };

    if (option?.hasView) {
      baseOptions.push(...viewOption);
    }

    if (option?.hasUpdate) {
      baseOptions.push(editOption);
    }
    if (option?.hasActivate) {
      baseOptions.push(activateOption);
    }
    if (option?.hasDeactivate) {
      baseOptions.push(deactivateOption);
    }
    return baseOptions;
  }

  const handleNextPage = useCallback(() => {
    if (pagination?.hasNextPage && pagination?.next) {
      // Set after as date string (API expects date string format)
      setQuery({ ...query, after: pagination.next } as any);
    }
  }, [pagination, query, setQuery]);

  const handleSetAfter = useCallback(
    (after: string) => {
      // Set after as date string or empty string to reset
      setQuery({ ...query, after: after || undefined } as any);
    },
    [query, setQuery]
  );

  // Calculate estimated total for display
  const estimatedTotal = useMemo(() => {
    return pagination?.hasNextPage
      ? (customers?.length || 0) + (query.limit || 10)
      : customers?.length || 0;
  }, [pagination, customers?.length, query.limit]);

  return {
    modal,
    query,
    tabConfigs,
    customers: customers || [],
    isLoadingCustomers,
    setQuery,
    getCustomerOptions,
    getSavingsOptions,
    pagination,
    handleNextPage,
    handleSetAfter,
    estimatedTotal,
  };
}
