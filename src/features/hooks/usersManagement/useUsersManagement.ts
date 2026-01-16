import { usePersistedModalState, useReducerSpread } from '@/hooks';
import { DEFAULT_QUERY, MODALS } from '@/utils/constants';
import { useUsers } from './useUsers';

export function useUsersManagementBase() {
  const [query, setQuery] = useReducerSpread(DEFAULT_QUERY);

  const modal = usePersistedModalState({
    paramName: MODALS.CUSTOMER.ROOT, // We can create a MODALS.USER.ROOT later if needed
  });

  const { data: users, isLoading: isLoadingUsers } = useUsers({
    limit: query.limit,
    ...(query.status && { status: query.status }),
    ...(query.search && { search: query.search }),
  });

  return {
    modal,
    query,
    users,
    isLoadingUsers,
    setQuery,
  };
}
