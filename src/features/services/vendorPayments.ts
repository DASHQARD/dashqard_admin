import { getList, getMethod, patchMethod, deleteMethod, putMethod } from '@/services';

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
  const response = await getList(commonUrl, query);
  return response?.data || response;
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

export const getVendorPaymentPreferences = async (
  vendorId: string | number
): Promise<any> => {
  try {
    const response = await getMethod(`/vendors/${vendorId}/payment-preferences`);
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

