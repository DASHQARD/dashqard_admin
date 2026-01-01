import { useReducerSpread } from '@/hooks';
import { DEFAULT_QUERY } from '@/utils';
import { superAdminInvitationsManagementQueries } from './superAdminInvitationsQueries';
import React from 'react';

export function useSuperAdminInvitationsManagementBase() {
  const [query, setQuery] = useReducerSpread(DEFAULT_QUERY);

  const { useGetSuperAdminInvitations } =
    superAdminInvitationsManagementQueries();

  // Build query params for API
  const queryParams = React.useMemo(() => {
    const params: Record<string, any> = {};
    if (query.limit) params.limit = query.limit;
    if (query.status) params.status = query.status;
    if (query.search) params.search = query.search;
    if (query.dateFrom) params.dateFrom = query.dateFrom;
    if (query.dateTo) params.dateTo = query.dateTo;
    if (query.after) params.after = query.after;
    return params;
  }, [query]);

  const { data, isLoading: isLoadingInvitations } =
    useGetSuperAdminInvitations(queryParams);

  const invitationsList = React.useMemo(() => {
    if (!data) return [];
    // Response structure: { data: [...], pagination: {...} }
    return Array.isArray(data?.data) ? data.data : [];
  }, [data]);

  const totalCount = React.useMemo(() => {
    // For cursor-based pagination, we might not have total count
    // Use the length of current data + pagination info
    return invitationsList.length;
  }, [invitationsList]);

  return {
    query,
    setQuery,
    invitationsList,
    isLoadingInvitations,
    totalCount,
    pagination: data?.pagination,
  };
}

