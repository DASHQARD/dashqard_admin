import { axiosClient } from '@/libs/axios';
import type { VendorCatalogQueryParams, VendorCatalogResponse } from '@/types';
import { getQueryString } from '@/utils/helpers';

/** GET /redemptions/vendors/{gvid}/catalog */
export const getVendorCatalog = async (
  gvid: string,
  query?: VendorCatalogQueryParams
): Promise<VendorCatalogResponse> => {
  const queryString = getQueryString(query);
  const base = `/redemptions/vendors/${encodeURIComponent(gvid)}/catalog`;
  const fullUrl = queryString ? `${base}?${queryString}` : base;
  return (await axiosClient.get(fullUrl)) as VendorCatalogResponse;
};
