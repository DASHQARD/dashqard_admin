import { getList, patchMethod } from '@/services';

const commonUrl = '/requests/admin';

export const getRequestCorporatesList = async (): Promise<any> => {
  return await getList(`${commonUrl}`);
};

export const getRequestCorporateDetails = async (id: string): Promise<any> => {
  return await getList(`${commonUrl}/info/${id}`);
};

export const updateRequestStatus = async (data: {
  id: string;
  status: string;
}): Promise<any> => {
  return await patchMethod(`${commonUrl}/update-status`, data);
};
