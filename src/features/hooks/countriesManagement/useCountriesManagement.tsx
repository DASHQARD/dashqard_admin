import { useReducerSpread } from '@/hooks';
import { DEFAULT_QUERY } from '@/utils';
import { countriesManagementQueries } from './countriesQueries';
import type { CountriesListQuery, Country } from '@/types/countries';
import React from 'react';

const VALID_COUNTRY_STATUSES = new Set(['active', 'inactive']);

export function useCountriesManagementBase() {
  const [query, setQuery] = useReducerSpread(DEFAULT_QUERY);
  const cursorStackRef = React.useRef<string[]>([]);

  const { useGetCountries } = countriesManagementQueries();

  const queryParams = React.useMemo((): CountriesListQuery => {
    const queryWithAfter = query as CountriesListQuery & { after?: string };
    const params: CountriesListQuery = {
      limit: query.limit || 10,
    };

    if (queryWithAfter.after?.trim()) {
      params.after = queryWithAfter.after.trim();
    }
    if (query.search?.trim()) {
      params.search = query.search.trim();
    }
    if (
      query.status &&
      VALID_COUNTRY_STATUSES.has(String(query.status).toLowerCase())
    ) {
      params.status = String(query.status).toLowerCase() as
        | 'active'
        | 'inactive';
    }

    return params;
  }, [query]);

  React.useEffect(() => {
    cursorStackRef.current = [];
  }, [query.search, query.status]);

  const { data, isLoading: isLoadingCountries } = useGetCountries(queryParams);

  const countriesList = React.useMemo((): Country[] => {
    if (!data?.data || !Array.isArray(data.data)) return [];
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
    if (!pagination.hasNextPage || !pagination.next) return;

    const currentAfter = (query as { after?: string }).after?.trim() ?? '';
    cursorStackRef.current.push(currentAfter);
    setQuery({ ...query, after: pagination.next } as typeof query);
  }, [pagination.hasNextPage, pagination.next, query, setQuery]);

  const handlePreviousPage = React.useCallback(() => {
    if (cursorStackRef.current.length === 0) {
      setQuery({ ...query, after: '' } as typeof query);
      return;
    }

    const previousAfter = cursorStackRef.current.pop() ?? '';
    setQuery({ ...query, after: previousAfter } as typeof query);
  }, [query, setQuery]);

  const handleSetAfter = React.useCallback(
    (after: string) => {
      setQuery({ ...query, after: after || '' } as typeof query);
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
