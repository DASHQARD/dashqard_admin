import { useReducerSpread } from '@/hooks';
import { DEFAULT_QUERY } from '@/utils';
import { rolesManagementQueries } from './rolesQueries';
import React from 'react';

export function useRolesManagementBase() {
  const [query, setQuery] = useReducerSpread(DEFAULT_QUERY);

  const { useGetAllRoles } = rolesManagementQueries();
  const { data, isLoading: isLoadingRoles } = useGetAllRoles();

  const rolesList = React.useMemo(() => {
    return data || [];
  }, [data]);

  return {
    query,
    setQuery,
    rolesList,
    isLoadingRoles,
  };
}
