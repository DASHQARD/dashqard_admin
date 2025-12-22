import { getList, patchMethod } from '@/services';

const commonUrl = '/corporates';

export const getCorporatesList = async (): Promise<any> => {
  return await getList(`${commonUrl}`);
};

export const getCorporateDetails = async (id: string): Promise<any> => {
  return await getList(`${commonUrl}/${id}`);
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
