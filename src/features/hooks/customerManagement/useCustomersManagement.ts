import {
  usePersistedModalState,
  useReducerSpread,
  // useSearch,
} from '@/hooks';
import { DEFAULT_QUERY, MODALS } from '@/utils/constants';
import { CustomerStuff } from '@/features/components/customerManagement';
import { useCustomers } from './useCustomers';

export function useCustomersManagementBase() {
  // const { state } = useSearch();

  const [query, setQuery] = useReducerSpread(DEFAULT_QUERY);

  const modal = usePersistedModalState({
    paramName: MODALS.CUSTOMER.ROOT,
  });

  const { data: customers, isLoading: isLoadingCustomers } = useCustomers({
    limit: query.limit,
    ...(query.status && { status: query.status }),
    ...(query.search && { search: query.search }),
  });

  console.log('customers', customers);

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

  return {
    modal,
    query,
    tabConfigs,
    customers,
    isLoadingCustomers,
    setQuery,
    getSavingsOptions,
  };
}
