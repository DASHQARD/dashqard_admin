import { getList, patchMethod } from '@/services';
import { axiosClient } from '@/libs/axios';

const commonUrl = '/corporates';

export const getCorporatesList = async (): Promise<any> => {
  return await getList(`${commonUrl}`);
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
