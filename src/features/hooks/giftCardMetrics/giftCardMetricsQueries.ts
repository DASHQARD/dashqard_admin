import { getGiftCardMetricsDetails } from '@/features/services/cards';
import type { GiftCardMetricsQueryParams } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function giftCardMetricsQueries() {
  function useGetGiftCardMetricsDetails(
    queryParams?: GiftCardMetricsQueryParams,
    options?: { enabled?: boolean }
  ) {
    return useQuery({
      queryKey: ['gift-card-metrics-details', queryParams],
      queryFn: () => getGiftCardMetricsDetails(queryParams),
      enabled: options?.enabled ?? true,
    });
  }

  return {
    useGetGiftCardMetricsDetails,
  };
}
