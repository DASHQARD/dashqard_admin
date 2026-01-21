import { getList, patchMethod } from '@/services';
import { axiosClient } from '@/libs/axios';
import { getQueryString } from '@/utils/helpers';

const commonUrl = '/corporates';

export const getCorporatesList = async (params?: Record<string, any>): Promise<any> => {
  const queryString = getQueryString(params);
  const fullUrl = queryString
    ? `${commonUrl}?${queryString}`
    : `${commonUrl}`;
  const response = await axiosClient.get(fullUrl);
  // Axios interceptor already returns response.data, so response here is the API response body
  // which has { data: [...], pagination: {...}, status: ..., etc }
  return response;
};

export const getCorporateDetails = async (id: string): Promise<any> => {
  // getList returns res.data, but we need the full response structure
  // Use axiosClient directly to get full response with status and data
  const response = await axiosClient.get(`${commonUrl}/${id}`);
  return response;
};

export const getCorporateBusinessDetails = async (id: string): Promise<any> => {
  return await getList(`${commonUrl}/business-details/${id}`);
};

export const updateCorporateStatus = async (data: {
  user_id: string;
  status: string;
  reason?: string;
}): Promise<any> => {
  return await patchMethod(`${commonUrl}/status`, data);
};

export const updateRequestCorporateStatus = async (data: {
  user_id: string;
  status: string;
  reason?: string;
}): Promise<any> => {
  return await patchMethod(`${commonUrl}/request-status`, data);
};
