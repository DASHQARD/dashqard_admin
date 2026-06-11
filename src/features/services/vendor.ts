import { getList, patchMethod } from '@/services';
import { axiosClient } from '@/libs/axios';
import type {
  AdminVendorsListResponse,
  AdminVendorsQueryParams,
} from '@/types';
import { getQueryString } from '@/utils/helpers';

const commonUrl = '/vendor-management';

export const getVendorsList = async (
  params?: AdminVendorsQueryParams
): Promise<AdminVendorsListResponse> => {
  const queryString = getQueryString(params);
  const fullUrl = queryString
    ? `${commonUrl}/admin/vendors?${queryString}`
    : `${commonUrl}/admin/vendors`;
  const response = (await axiosClient.get(fullUrl)) as AdminVendorsListResponse;
  // Axios interceptor already returns response.data, so response here is the API response body
  // which has { data: [...], pagination: {...}, status: ..., etc }
  return response;
};

export const getVendorDetails = async (id: string | number): Promise<any> => {
  const response = await getList(`${commonUrl}/vendor/${id}`);
  return response?.data || response;
};

export const getVendorQrCode = async (id: string | number): Promise<any> => {
  const response = await getList(`${commonUrl}/qr-code/${id}`);
  return response?.data || response;
};

export const approveVendor = async (data: {
  vendor_account_id: string | number;
  approval_status: 'approved' | 'rejected';
  rejection_reason?: string;
}): Promise<any> => {
  return await patchMethod(`${commonUrl}/admin/approve`, data);
};

export const updateVendorAccountStatus = async (data: {
  vendor_account_id: string | number;
  approval_status: 'approved' | 'rejected';
  rejection_reason?: string;
}): Promise<any> => {
  return await patchMethod(`${commonUrl}/admin/approve`, data);
};

export const removeVendorAdmin = async (data: {
  vendor_user_id: number;
  password: string;
}): Promise<any> => {
  return await patchMethod(`${commonUrl}/remove-vendor-admin`, data);
};
