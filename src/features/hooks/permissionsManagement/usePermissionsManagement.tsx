import { useReducerSpread } from '@/hooks';
import { DEFAULT_QUERY } from '@/utils';
import { permissionsManagementQueries } from './permissionsQueries';
import React from 'react';

export function usePermissionsManagementBase() {
  const [query, setQuery] = useReducerSpread(DEFAULT_QUERY);

  const { useGetAllPermissions } = permissionsManagementQueries();
  const { data, isLoading: isLoadingPermissions } = useGetAllPermissions();

  const permissionsList = React.useMemo(() => {
    return data || [];
  }, [data]);

  return {
    query,
    setQuery,
    permissionsList,
    isLoadingPermissions,
  };
}
