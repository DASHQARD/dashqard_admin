import { deleteMethod, getList, getMethod, patchMethod } from '@/services';

const commonUrl = '/requests/admin';

export const getRequestCorporatesList = async (): Promise<any> => {
  const response = await getList(`${commonUrl}`);
  // Response structure: { status, statusCode, message, data: [...], pagination: {...} }
  // Extract the data array from the response
  return response?.data || response;
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
