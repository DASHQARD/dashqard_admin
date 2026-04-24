import { useReducerSpread } from '@/hooks';
import { DEFAULT_QUERY } from '@/utils';
import { countriesManagementQueries } from './countriesQueries';
import React from 'react';

export function useCountriesManagementBase() {
  const [query, setQuery] = useReducerSpread(DEFAULT_QUERY);

  const { useGetCountries } = countriesManagementQueries();
  const queryWithAfter = query as any;
  const queryParams = React.useMemo(
    () => ({
      limit: query.limit || 10,
      after: queryWithAfter.after || undefined,
      search: query.search || undefined,
      status: query.status || undefined,
    }),
    [query.limit, query.search, query.status, queryWithAfter.after]
  );
  const { data, isLoading: isLoadingCountries } = useGetCountries(queryParams);

  const countriesList = React.useMemo(() => {
    if (!data) return [];
    return data.data;
  }, [data]);

  const pagination = React.useMemo(() => {
    return {
      hasNextPage: data?.pagination?.hasNextPage ?? false,
      hasPreviousPage: data?.pagination?.hasPreviousPage ?? false,
      next: data?.pagination?.next ?? null,
      previous: data?.pagination?.previous ?? null,
    };
  }, [data]);

  const handleNextPage = React.useCallback(() => {
    if (pagination.hasNextPage && pagination.next) {
      setQuery({ ...query, after: pagination.next } as any);
    }
  }, [pagination.hasNextPage, pagination.next, query, setQuery]);

  const handlePreviousPage = React.useCallback(() => {
    if (!pagination.hasPreviousPage) return;
    setQuery({ ...query, after: pagination.previous ?? '' } as any);
  }, [pagination.hasPreviousPage, pagination.previous, query, setQuery]);

  const handleSetAfter = React.useCallback(
    (after: string) => {
      setQuery({ ...query, after: after || '' } as any);
    },
    [query, setQuery]
  );

  return {
    query,
    setQuery,
    countriesList,
    isLoadingCountries,
    pagination,
    handleNextPage,
    handlePreviousPage,
    handleSetAfter,
  };
}
