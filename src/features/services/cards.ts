import { axiosClient } from '@/libs/axios';
import type {
  GiftCardMetricsDetailsResponse,
  GiftCardMetricsQueryParams,
} from '@/types';
import { getQueryString } from '@/utils/helpers';

const commonUrl = '/cards';

export const getGiftCardMetricsDetails = async (
  params?: GiftCardMetricsQueryParams
): Promise<GiftCardMetricsDetailsResponse> => {
  const queryString = getQueryString(params);
  const fullUrl = queryString
    ? `${commonUrl}/users/metrics/details?${queryString}`
    : `${commonUrl}/users/metrics/details`;
  const response = (await axiosClient.get(
    fullUrl
  )) as GiftCardMetricsDetailsResponse;
  return response;
};
