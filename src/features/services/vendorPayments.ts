import {
  getList,
  getMethod,
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
  const fullUrl = queryString ? `${commonUrl}?${queryString}` : `${commonUrl}`;
  const response = await axiosClient.get(fullUrl);
  // Axios interceptor already returns response.data, so response here is the API response body
  // which has { data: [...], pagination: {...}, status: ..., etc }
  return response;
};

/** Query string for GET /vendor-payments/admin/vendors/:vendor_id/branches */
export type AdminVendorBranchesQueryParams = {
  limit?: number;
  after?: string;
  status?: string;
  payment_frequency?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
};

export type AdminVendorBranchPaymentSummary = {
  paid_count: number;
  total_paid: number;
  grand_total: number;
  total_count: number;
  overdue_count: number;
  pending_count: number;
  total_overdue: number;
  total_pending: number;
};

/** Single branch row from GET /vendor-payments/admin/vendors/:vendor_id/branches */
export type AdminVendorBranch = {
  id: string;
  user_id: number;
  vendor_id: number;
  gvid: string;
  branch_manager_name: string;
  branch_manager_email: string;
  branch_name: string;
  branch_location: string;
  full_branch_id: string;
  branch_code: string;
  branch_type: string;
  parent_branch_id: string | null;
  created_at: string;
  updated_at: string;
  branch_manager_user_id: number;
  payment_summary: AdminVendorBranchPaymentSummary;
};

/** Response body for GET /vendor-payments/admin/vendors/:vendor_id/branches */
export type AdminVendorBranchesListResponse = {
  status: string;
  statusCode: number;
  message: string;
  data: AdminVendorBranch[];
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  next: string | null;
  previous: string | null;
  url?: string;
};

/** GET /vendor-payments/admin/vendors/{vendor_id}/branches */
export const getAdminVendorBranches = async (
  vendorId: string | number,
  query?: AdminVendorBranchesQueryParams
): Promise<AdminVendorBranchesListResponse> => {
  const queryString = getQueryString(query);
  const base = `${commonUrl}/admin/vendors/${vendorId}/branches`;
  const fullUrl = queryString ? `${base}?${queryString}` : base;
  // Interceptor returns response body, not AxiosResponse
  const response = (await axiosClient.get(
    fullUrl
  )) as AdminVendorBranchesListResponse;
  return response;
};

export const getVendorPaymentsSummary = async (
  query?: VendorPaymentsSummaryQueryParams
): Promise<any> => {
  const response = await getList(`${commonUrl}/summary`, query);
  return response?.data || response;
};

/** Mobile money entry under `payment_methods` on GET /vendor-payments/:id */
export type VendorPaymentMethodsMobileMoney = {
  id: number;
  provider: string;
  number: string;
};

/** Bank account entry (shape may vary by API) */
export type VendorPaymentMethodsBankAccount = {
  id?: number;
  bank_name?: string;
  account_number?: string;
  account_name?: string;
  [key: string]: unknown;
};

/** Nested `payment_methods` on GET /vendor-payments/:id */
export type VendorPaymentMethodsPayload = {
  bank_accounts: VendorPaymentMethodsBankAccount[];
  mobile_money: VendorPaymentMethodsMobileMoney[];
};

/** Record inside `data` for GET /vendor-payments/:id success response */
export type VendorPaymentDetail = {
  id: number;
  vendor_id: number;
  vendor_user_id: number;
  invoice_number: string;
  payment_frequency: string;
  branch_location: string;
  branch_id: number;
  payment_amount: string | number;
  payment_period: string;
  status: string;
  due_date: string;
  paid_date: string | null;
  description: string;
  created_at: string;
  updated_at: string;
  transaction_reference: string | null;
  notes: string | null;
  payment_method: string | null;
  vendor_name: string;
  vendor_gvid: string;
  branch_manager_user_id?: number;
  branch_manager_phone_number?: string | null;
  branch_phone_number?: string | null;
  payment_methods?: VendorPaymentMethodsPayload;
};

type VendorPaymentByIdEnvelope = {
  status: string;
  statusCode: number;
  message: string;
  data: VendorPaymentDetail;
  url?: string;
};

function isVendorPaymentByIdEnvelope(
  raw: unknown
): raw is VendorPaymentByIdEnvelope {
  return (
    typeof raw === 'object' &&
    raw !== null &&
    'data' in raw &&
    'statusCode' in raw &&
    typeof (raw as VendorPaymentByIdEnvelope).data === 'object' &&
    (raw as VendorPaymentByIdEnvelope).data !== null &&
    'id' in (raw as VendorPaymentByIdEnvelope).data
  );
}

/** Normalizes GET /vendor-payments/:id whether the client receives the envelope or inner `data`. */
function unwrapVendorPaymentDetail(raw: unknown): VendorPaymentDetail {
  if (isVendorPaymentByIdEnvelope(raw)) {
    return raw.data;
  }
  return raw as VendorPaymentDetail;
}

export const getVendorPaymentById = async (
  id: string
): Promise<VendorPaymentDetail> => {
  const raw = await getMethod<unknown>(commonUrl, id);
  return unwrapVendorPaymentDetail(raw);
};

export type UpdateVendorPaymentData = {
  status?: 'pending' | 'paid' | 'overdue';
  paid_date?: string;
  payment_amount?: number;
  description?: string;
  due_date?: string;
  payment_period?: string;
};

/** PUT /vendor-payments/:id */
export const updateVendorPayment = async (
  id: string,
  data: UpdateVendorPaymentData
): Promise<any> => {
  const response = await putMethod(`${commonUrl}/${id}`, data);
  return response?.data || response;
};

export type CreateVendorPaymentPayload = {
  vendor_id: number;
  vendor_user_id: number;
  payment_frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly';
  branch_location: string;
  branch_id: number;
  payment_amount: number;
  payment_period: string;
  due_date: string;
  description: string;
};

/** POST /vendor-payments — create payment record (invoice is assigned server-side). */
export const createVendorPayment = async (
  data: CreateVendorPaymentPayload
): Promise<any> => {
  return await postMethod(commonUrl, data);
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

/**
 * POST /vendor-payments/process-payment — payout via the active gateway from
 * GET /payment-provider-config (Paystack, Eganow, ExpressPay BillPay).
 */
export type ProcessVendorPaymentPayload = {
  id: number;
  payment_method: 'bank' | 'mobile_money';
  /** ISO 8601 datetime */
  payment_date: string;
  notes?: string;
  /** GhIPSS sort code / Eganow paypartner / ExpressPay package code */
  bank_code?: string;
  account_number?: string;
  /** International format, e.g. 233559617908 (+ stripped by API) */
  mobile_money_number?: string;
  /** mtn | vodafone | airtel-tigo */
  mobile_money_provider?: string;
};

export const processVendorPayment = async (
  data: ProcessVendorPaymentPayload
): Promise<any> => {
  return await postMethod(`${commonUrl}/process-payment`, data);
};
