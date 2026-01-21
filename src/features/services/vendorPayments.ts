import {
  getList,
  getMethod,
  patchMethod,
  deleteMethod,
  putMethod,
  postMethod,
} from '@/services';
import { axiosClient } from '@/libs/axios';
import { getQueryString } from '@/utils/helpers';

const commonUrl = '/vendor-payments';

export type VendorPaymentsQueryParams = {
  limit?: number;
  after?: string;
  vendor_id?: number;
  vendor_user_id?: number;
  status?: 'pending' | 'paid' | 'overdue';
  payment_frequency?: 'daily' | 'weekly' | 'bi-weekly' | 'monthly';
  branch_location?: string;
  branch_id?: number;
  payment_period?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
};

export type VendorPaymentsSummaryQueryParams = {
  vendor_id?: number;
  vendor_user_id?: number;
  payment_frequency?: 'daily' | 'weekly' | 'bi-weekly' | 'monthly';
  branch_location?: string;
  branch_id?: number;
  date_from?: string;
  date_to?: string;
};

export const getVendorPayments = async (
  query?: VendorPaymentsQueryParams
): Promise<any> => {
  const queryString = getQueryString(query);
  const fullUrl = queryString
    ? `${commonUrl}?${queryString}`
    : `${commonUrl}`;
  const response = await axiosClient.get(fullUrl);
  // Axios interceptor already returns response.data, so response here is the API response body
  // which has { data: [...], pagination: {...}, status: ..., etc }
  return response;
};

export const getVendorPaymentsSummary = async (
  query?: VendorPaymentsSummaryQueryParams
): Promise<any> => {
  const response = await getList(`${commonUrl}/summary`, query);
  return response?.data || response;
};

export const getVendorPaymentById = async (id: string): Promise<any> => {
  const response = await getMethod(commonUrl, id);
  return response?.data || response;
};

export type UpdateVendorPaymentData = {
  status?: 'pending' | 'paid' | 'overdue';
  paid_date?: string;
  payment_amount?: number;
  description?: string;
  due_date?: string;
  payment_period?: string;
};

export const updateVendorPayment = async (
  id: string,
  data: UpdateVendorPaymentData
): Promise<any> => {
  const response = await patchMethod(`${commonUrl}/${id}`, data);
  return response?.data || response;
};

export const deleteVendorPayment = async (id: string): Promise<any> => {
  const response = await deleteMethod(`${commonUrl}/${id}`);
  return response?.data || response;
};

export const getBanks = async (): Promise<any> => {
  return await getMethod('payments/banks');
};

export const getVendorPaymentPreferences = async (
  vendorId: string | number
): Promise<any> => {
  try {
    const response = await getMethod(
      `/vendors/${vendorId}/payment-preferences`
    );
    return response?.data || response;
  } catch (error: any) {
    // Handle 404 - preferences not found, return null to allow creation
    if (error?.status === 404) {
      return null;
    }
    throw error;
  }
};

export type UpdateVendorPaymentPreferencesData = {
  payment_frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly';
};

export const updateVendorPaymentPreferences = async (
  vendorId: string | number,
  data: UpdateVendorPaymentPreferencesData
): Promise<any> => {
  const response = await putMethod(
    `/vendors/${vendorId}/payment-preferences`,
    data
  );
  return response?.data || response;
};

export const processVendorPayment = async (data: {
  id: number;
  payment_method: 'bank' | 'mobile_money';
  bank_code: string;
  account_number: string;
  mobile_money_number: string;
  mobile_money_provider: 'mtn' | 'vodafone' | 'airtel';
  payment_date: string;
  notes: string;
}): Promise<any> => {
  return await postMethod(`${commonUrl}/process-payment`, data);
};
