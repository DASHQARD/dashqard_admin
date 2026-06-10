import { useReducerSpread } from '@/hooks';
import type { GiftCardMetricsQueryParams } from '@/types';
import { DEFAULT_QUERY } from '@/utils';
import React, { useCallback, useMemo } from 'react';

import { giftCardMetricsQueries } from './giftCardMetricsQueries';

const GIFT_CARD_METRICS_DEFAULT_QUERY = {
  ...DEFAULT_QUERY,
  card_type: 'DashX',
};

export function useGiftCardMetrics() {
  const [query, setQuery] = useReducerSpread(GIFT_CARD_METRICS_DEFAULT_QUERY);

  const { useGetGiftCardMetricsDetails } = giftCardMetricsQueries();

  const paramsForApi = useMemo(() => {
    const apiParams: GiftCardMetricsQueryParams = {
      limit: query.limit || 10,
    };

    if (query.after) {
      apiParams.after = String(query.after);
    }
    if (query.card_type) {
      apiParams.card_type = query.card_type;
    }
    if (query.search) {
      apiParams.search = query.search;
    }
    if (query.date_from) {
      apiParams.date_from = String(query.date_from);
    }
    if (query.date_to) {
      apiParams.date_to = String(query.date_to);
    }

    return apiParams;
  }, [query]);

  const { data, isLoading } = useGetGiftCardMetricsDetails(paramsForApi);

  const metricsList = React.useMemo(() => {
    return data?.data?.data ?? [];
  }, [data]);

  const pagination = React.useMemo(() => {
    const payload = data?.data;
    return {
      hasNextPage: payload?.hasNextPage ?? false,
      hasPreviousPage: payload?.hasPreviousPage ?? false,
      next: payload?.next ?? null,
      previous: payload?.previous ?? null,
    };
  }, [data]);

  const handleNextPage = useCallback(() => {
    if (pagination.hasNextPage && pagination.next) {
      setQuery({ ...query, after: pagination.next });
    }
  }, [pagination, query, setQuery]);

  const handleSetAfter = useCallback(
    (after: string) => {
      setQuery({ ...query, after: after || '' });
    },
    [query, setQuery]
  );

  return {
    query,
    setQuery,
    metricsList,
    isLoading,
    pagination,
    handleNextPage,
    handleSetAfter,
  };
}
