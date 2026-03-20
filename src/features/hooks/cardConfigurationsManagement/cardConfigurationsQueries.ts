import { getCardConfigurations } from '@/features/services';
import { useQuery } from '@tanstack/react-query';

export function cardConfigurationsManagementQueries() {
  function useGetCardConfigurations() {
    return useQuery({
      queryKey: ['card-configurations'],
      queryFn: getCardConfigurations,
    });
  }

  return {
    useGetCardConfigurations,
  };
}

