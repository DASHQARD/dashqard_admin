import { getServiceFees } from '@/features/services';
import { useQuery } from '@tanstack/react-query';

export function feesManagementQueries() {
  function useGetServiceFees() {
    return useQuery({
      queryKey: ['service-fees'],
      queryFn: getServiceFees,
    });
  }

  return {
    useGetServiceFees,
  };
}
