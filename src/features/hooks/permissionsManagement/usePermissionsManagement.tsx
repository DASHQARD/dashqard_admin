import { useReducerSpread } from '@/hooks';
import { DEFAULT_QUERY } from '@/utils';
import { permissionsManagementQueries } from './permissionsQueries';
import React from 'react';

export function usePermissionsManagementBase() {
  const [query, setQuery] = useReducerSpread(DEFAULT_QUERY);

  const { useGetAllPermissions } = permissionsManagementQueries();
  const apiQuery = React.useMemo(() => {
    const apiParams: any = {
      limit: query.limit || 10,
    };
    const q = query as any;
    if (q.after != null && q.after !== '') {
      apiParams.after = q.after;
    }
    if (query.search) {
      apiParams.search = query.search;
    }
    return apiParams;
  }, [query]);

  const { data, isLoading: isLoadingPermissions } =
    useGetAllPermissions(apiQuery);

  const permissionsList = React.useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return data.data || [];
  }, [data]);

  const paginationInfo = React.useMemo(() => {
    if (!data || Array.isArray(data)) {
      return {
        hasNextPage: false,
        hasPreviousPage: false,
        next: null,
        previous: null,
      };
    }
    const pagination = data.pagination;
    return {
      hasNextPage: pagination?.hasNextPage ?? false,
      hasPreviousPage: pagination?.hasPreviousPage ?? false,
      next: pagination?.next ?? null,
      previous: pagination?.previous ?? null,
    };
  }, [data]);

  const handleNextPage = React.useCallback(() => {
    if (paginationInfo.hasNextPage && paginationInfo.next != null) {
      setQuery({ ...query, after: paginationInfo.next } as any);
    }
  }, [paginationInfo, query, setQuery]);

  const handlePreviousPage = React.useCallback(() => {
    if (paginationInfo.hasPreviousPage && paginationInfo.previous != null) {
      setQuery({ ...query, after: paginationInfo.previous } as any);
      return;
    }
    if (!paginationInfo.hasPreviousPage) {
      const q = query as any;
      const nextQuery = { ...q };
      delete nextQuery.after;
      setQuery(nextQuery);
    }
  }, [paginationInfo, query, setQuery]);

  return {
    query,
    setQuery,
    permissionsList,
    isLoadingPermissions,
    paginationInfo,
    handleNextPage,
    handlePreviousPage,
  };
}
