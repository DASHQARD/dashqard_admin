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
    const q = query as { after?: string };
    const afterSet = q.after != null && q.after !== '';
    const previous = pagination?.previous ?? null;
    const hasPreviousFromApi = pagination?.hasPreviousPage ?? false;

    // API may report hasPreviousPage while previous is null; if `after` is set we can still go back (clear cursor).
    const hasPreviousPage =
      afterSet || (hasPreviousFromApi && previous != null);

    return {
      hasNextPage: pagination?.hasNextPage ?? false,
      hasPreviousPage,
      next: pagination?.next ?? null,
      previous,
    };
  }, [data, query]);

  const handleNextPage = React.useCallback(() => {
    if (paginationInfo.hasNextPage && paginationInfo.next != null) {
      setQuery({ ...query, after: paginationInfo.next } as any);
    }
  }, [paginationInfo, query, setQuery]);

  const handlePreviousPage = React.useCallback(() => {
    const q = query as { after?: string };
    if (q.after && paginationInfo.previous != null) {
      setQuery({ ...query, after: paginationInfo.previous } as any);
      return;
    }
    if (q.after) {
      // useReducerSpread merges partial state — must set `after: ''`, omitting the key leaves the old cursor.
      setQuery({ ...query, after: '' } as any);
    }
  }, [paginationInfo.previous, query, setQuery]);

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
