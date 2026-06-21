import { axiosClient } from '@/libs/axios';
import type {
  VendorBranchesListResponse,
  VendorBranchesQueryParams,
  VendorsAllDetailsQueryParams,
  VendorsAllDetailsResponse,
} from '@/types';
import { getQueryString } from '@/utils/helpers';

/** GET /branches/vendor/{vendor_id} */
export const getVendorBranches = async (
  vendorId: string,
  query?: VendorBranchesQueryParams
): Promise<VendorBranchesListResponse> => {
  const queryString = getQueryString(query);
  const base = `/branches/vendor/${vendorId}`;
  const fullUrl = queryString ? `${base}?${queryString}` : base;
  return (await axiosClient.get(fullUrl)) as VendorBranchesListResponse;
};

/** GET /vendors/all/details */
export const getVendorsAllDetails = async (
  query?: VendorsAllDetailsQueryParams
): Promise<VendorsAllDetailsResponse> => {
  const queryString = getQueryString(query);
  const base = '/vendors/all/details';
  const fullUrl = queryString ? `${base}?${queryString}` : base;
  return (await axiosClient.get(fullUrl)) as VendorsAllDetailsResponse;
};
