import {
  getAllCountriesList,
  getCountriesList,
  getCountryById,
  getCountryByCode,
  getCountryByIso,
  type CountriesListQuery,
} from '@/features/services';
import { useQuery } from '@tanstack/react-query';

export function countriesManagementQueries() {
  function useGetCountries(query?: CountriesListQuery) {
    return useQuery({
      queryKey: ['countries', query],
      queryFn: () => getCountriesList(query),
    });
  }

  function useGetAllCountries() {
    return useQuery({
      queryKey: ['countries', 'all'],
      queryFn: () => getAllCountriesList(),
    });
  }

  function useGetCountryById(id: string) {
    return useQuery({
      queryKey: ['country', id],
      queryFn: () => getCountryById(id),
      enabled: !!id,
    });
  }

  function useGetCountryByCode(code: string) {
    return useQuery({
      queryKey: ['country-by-code', code],
      queryFn: () => getCountryByCode(code),
      enabled: !!code,
    });
  }

  function useGetCountryByIso(isoCode: string) {
    return useQuery({
      queryKey: ['country-by-iso', isoCode],
      queryFn: () => getCountryByIso(isoCode),
      enabled: !!isoCode,
    });
  }

  return {
    useGetCountries,
    useGetAllCountries,
    useGetCountryById,
    useGetCountryByCode,
    useGetCountryByIso,
  };
}
