import { deleteMethod, getMethod, getList, patchMethod } from '@/services';
import { axiosClient } from '@/libs/axios';
import { getQueryString } from '@/utils/helpers';

const commonUrl = '/payments';

export const verifyPayment = async (reference: string): Promise<any> => {
  const response = await getMethod(`${commonUrl}/verify/${reference}`);
  return response?.data || response;
};

export const getPaymentsByUserId = async (
  userId: string,
  query?: {
    status?: string;
    type?: string;
    date_from?: string;
    date_to?: string;
  }
): Promise<any> => {
  // Use getList which handles query params properly
  const response = await getList(`${commonUrl}/user/${userId}`, query);
  return response?.data || response;
};

export const getPaymentsWithUserDetails = async (): Promise<any> => {
  const response = await getMethod(`${commonUrl}/with-user-details`);
  return response?.data || response;
};

export const getPaymentByReceiptNumber = async (
  receiptNumber: string
): Promise<any> => {
  const response = await getMethod(`${commonUrl}/receipt/${receiptNumber}`);
  return response?.data || response;
};

export const getPaymentById = async (id: string): Promise<any> => {
  const response = await getMethod(`${commonUrl}/${id}`);
  return response?.data || response;
};

export const getPaymentsList = async (
  query?: Record<string, any>
): Promise<any> => {
  const queryString = getQueryString(query);
  const fullUrl = queryString ? `${commonUrl}?${queryString}` : `${commonUrl}`;
  const response = await axiosClient.get(fullUrl);
  // Axios interceptor already returns response.data, so response here is the API response body
  // which has { data: [...], pagination: {...}, status: ..., etc }
  return response;
};

export const deletePayment = async (id: string): Promise<any> => {
  return await deleteMethod(`${commonUrl}/${id}`);
};

export const updatePaymentStatus = async (
  id: string,
  data: { status: string }
): Promise<any> => {
  return await patchMethod(`${commonUrl}/${id}/status`, data);
};
