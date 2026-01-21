import { useReducerSpread } from '@/hooks';
import { DEFAULT_QUERY } from '@/utils';
import { superAdminInvitationsManagementQueries } from './superAdminInvitationsQueries';
import React, { useCallback, useMemo } from 'react';

export function useSuperAdminInvitationsManagementBase() {
  const [query, setQuery] = useReducerSpread(DEFAULT_QUERY);

  const { useGetSuperAdminInvitations } =
    superAdminInvitationsManagementQueries();

  // Build query params for API with cursor support
  const queryParams = React.useMemo(() => {
    const params: Record<string, any> = {
      limit: query.limit || 10,
    };
    const queryWithAfter = query as any;
    if (queryWithAfter.after) {
      // Send after as date string (API expects date string format)
      params.after = queryWithAfter.after;
    }
    if (query.status) params.status = query.status;
    if (query.search) params.search = query.search;
    return params;
  }, [query]);

  const { data, isLoading: isLoadingInvitations } =
    useGetSuperAdminInvitations(queryParams);

  const invitationsList = React.useMemo(() => {
    if (!data) return [];
    // Response structure: { data: [...], pagination: {...} }
    return Array.isArray(data?.data) ? data.data : [];
  }, [data]);

  const pagination = React.useMemo(() => {
    if (!data || Array.isArray(data)) {
      return {
        hasNextPage: false,
        hasPreviousPage: false,
        next: null,
        previous: null,
      };
    }
    return {
      hasNextPage: data.pagination?.hasNextPage ?? false,
      hasPreviousPage: data.pagination?.hasPreviousPage ?? false,
      next: data.pagination?.next ?? null,
      previous: data.pagination?.previous ?? null,
    };
  }, [data]);

  const handleNextPage = useCallback(() => {
    if (pagination?.hasNextPage && pagination?.next) {
      // Set after as date string (API expects date string format)
      setQuery({ ...query, after: pagination.next } as any)
    }
  }, [pagination, query, setQuery])

  const handleSetAfter = useCallback(
    (after: string) => {
      // Set after as date string or empty string to reset
      setQuery({ ...query, after: after || undefined } as any)
    },
    [query, setQuery],
  )

  const totalCount = useMemo(() => {
    // For cursor-based pagination, use estimated total
    return pagination?.hasNextPage
      ? invitationsList.length + (query.limit || 10)
      : invitationsList.length;
  }, [pagination, invitationsList.length, query.limit]);

  return {
    query,
    setQuery,
    invitationsList,
    isLoadingInvitations,
    totalCount,
    pagination,
    handleNextPage,
    handleSetAfter,
  };
}
