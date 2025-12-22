import {
  getRequestCorporatesList,
  getRequestCorporateDetails,
} from '@/features/services';
import { useQuery } from '@tanstack/react-query';

export function requestManagementQueries() {
  function useGetRequestCorporates() {
    return useQuery({
      queryKey: ['request-corporates'],
      queryFn: () => getRequestCorporatesList(),
    });
  }

  function useGetRequestCorporateDetails(id: string) {
    return useQuery({
      queryKey: ['request-corporate-details', id],
      queryFn: () => getRequestCorporateDetails(id),
      enabled: !!id,
    });
  }

  return {
    useGetRequestCorporates,
    useGetRequestCorporateDetails,
  };
}
