import {
  getRequestCorporatesList,
  getRequestDetails,
} from '@/features/services';
import { useQuery } from '@tanstack/react-query';

export function requestManagementQueries() {
  function useGetRequestCorporates(query?: Record<string, any>) {
    return useQuery({
      queryKey: ['request-corporates', query],
      queryFn: () => getRequestCorporatesList(query),
    });
  }

  function useGetRequestDetails(id: string) {
    return useQuery({
      queryKey: ['request-details', id],
      queryFn: () => getRequestDetails(id),
      enabled: !!id,
    });
  }

  // Keep for backward compatibility
  function useGetRequestCorporateDetails(id: string) {
    return useGetRequestDetails(id);
  }

  return {
    useGetRequestCorporates,
    useGetRequestDetails,
    useGetRequestCorporateDetails,
  };
}
