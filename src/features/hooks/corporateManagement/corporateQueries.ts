import {
  getCorporatesList,
  getCorporateDetails,
  getCorporateBusinessDetails,
} from '@/features/services';
import { useQuery } from '@tanstack/react-query';

export function corporateManagementQueries() {
  function useGetCorporates() {
    return useQuery({
      queryKey: ['corporates'],
      queryFn: () => getCorporatesList(),
    });
  }

  function useGetCorporateDetails(id: string) {
    return useQuery({
      queryKey: ['corporate-details', id],
      queryFn: () => getCorporateDetails(id),
      enabled: !!id,
    });
  }

  function useGetCorporateBusinessDetails(id: string) {
    return useQuery({
      queryKey: ['corporate-business-details', id],
      queryFn: () => getCorporateBusinessDetails(id),
      enabled: false,
    });
  }

  return {
    useGetCorporates,
    useGetCorporateDetails,
    useGetCorporateBusinessDetails,
  };
}
