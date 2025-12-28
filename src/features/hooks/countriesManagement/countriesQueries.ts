import {
  getCountriesList,
  getCountryById,
  getCountryByCode,
  getCountryByIso,
} from '@/features/services';
import { useQuery } from '@tanstack/react-query';

export function countriesManagementQueries() {
  function useGetCountries() {
    return useQuery({
      queryKey: ['countries'],
      queryFn: () => getCountriesList(),
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
    useGetCountryById,
    useGetCountryByCode,
    useGetCountryByIso,
  };
}

