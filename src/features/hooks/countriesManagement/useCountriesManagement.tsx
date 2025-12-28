import { useReducerSpread } from '@/hooks';
import { DEFAULT_QUERY } from '@/utils';
import { countriesManagementQueries } from './countriesQueries';
import React from 'react';

export function useCountriesManagementBase() {
  const [query, setQuery] = useReducerSpread(DEFAULT_QUERY);

  const { useGetCountries } = countriesManagementQueries();
  const { data, isLoading: isLoadingCountries } = useGetCountries();

  const countriesList = React.useMemo(() => {
    if (!data) return [];
    // Response is already the data array from the service
    return Array.isArray(data) ? data : [];
  }, [data]);

  // Filter countries based on search query (client-side filtering)
  const filteredCountriesList = React.useMemo(() => {
    if (!query.search) return countriesList;

    const searchLower = query.search.toLowerCase();
    return countriesList.filter((country: any) => {
      return (
        country.name?.toLowerCase().includes(searchLower) ||
        country.code?.toLowerCase().includes(searchLower) ||
        country.iso_code?.toLowerCase().includes(searchLower) ||
        country.currency?.toLowerCase().includes(searchLower)
      );
    });
  }, [countriesList, query.search]);

  return {
    query,
    setQuery,
    countriesList: filteredCountriesList,
    isLoadingCountries,
  };
}
