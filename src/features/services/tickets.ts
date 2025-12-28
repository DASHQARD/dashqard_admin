import { getList, getMethod, patchMethod, postMethod } from '@/services';

const commonUrl = '/tickets';

export const getTicketsList = async (): Promise<any> => {
  const response = await getList(commonUrl);
  // Response structure: { status, statusCode, message, data: [...], pagination: {...} }
  // Extract the data array from the response
  return response?.data || response;
};

export const getTicketById = async (id: string): Promise<any> => {
  const response = await getMethod(`${commonUrl}/${id}`);
  // Response structure: { status, statusCode, message, data: {...} }
  // Extract the data object from the response
  return response?.data || response;
};

export const createTicket = async (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<any> => {
  return await postMethod(commonUrl, data);
};

export const updateTicketStatus = async (
  id: string,
  data: { status?: string }
): Promise<any> => {
  return await patchMethod(`${commonUrl}/${id}/status`, data);
};
