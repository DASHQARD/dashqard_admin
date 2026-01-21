import { deleteMethod, getMethod, patchMethod } from '@/services';
import { axiosClient } from '@/libs/axios';
import { getQueryString } from '@/utils/helpers';

const commonUrl = '/requests/admin';

export const getRequestCorporatesList = async (params?: Record<string, any>): Promise<any> => {
  const queryString = getQueryString(params);
  const fullUrl = queryString
    ? `${commonUrl}?${queryString}`
    : `${commonUrl}`;
  const response = await axiosClient.get(fullUrl);
  // Axios interceptor already returns response.data, so response here is the API response body
  // which has { data: [...], pagination: {...}, status: ..., etc }
  return response;
};

export const getRequestDetails = async (id: string): Promise<any> => {
  const response = await getMethod(`${commonUrl}/info/${id}`);
  // Response structure: { status, statusCode, message, data: {...} }
  // Extract the data object from the response
  return response?.data || response;
};

// Keep for backward compatibility, but use getRequestDetails instead
export const getRequestCorporateDetails = async (id: string): Promise<any> => {
  return await getRequestDetails(id);
};

export const updateRequestStatus = async (data: {
  id: string;
  status: string;
}): Promise<any> => {
  return await patchMethod(`${commonUrl}/update-status`, data);
};

export const deleteRequest = async (id: string): Promise<any> => {
  return await deleteMethod(`${commonUrl}/delete/${id}`);
};
