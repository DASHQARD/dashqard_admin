import {
  getList,
  getMethod,
  deleteMethod,
  putMethod,
  postMethod,
} from '@/services';
import { axiosClient } from '@/libs/axios';
import type {
  AdminVendorBranchesListResponse,
  AdminVendorBranchesQueryParams,
} from '@/types';
import { getQueryString } from '@/utils/helpers';

const commonUrl = '/vendor-payments';

export type VendorPaymentsQueryParams = {
  limit?: number;
  after?: string;
  vendor_id?: number | string;
  vendor_user_id?: number | string;
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
  vendor_id?: number | string;
  vendor_user_id?: number | string;
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
  sort_code?: string;
  bank_code?: string;
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
  vendor_id: number | string;
  vendor_user_id: number | string;
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
  const detail = unwrapVendorPaymentDetail(raw);
  // Some API responses omit `id` on the body; keep the requested id for mutations.
  if (detail.id == null && id.trim()) {
    const asNum = Number(id);
    return {
      ...detail,
      id: Number.isFinite(asNum) ? asNum : (id as unknown as number),
    };
  }
  return detail;
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
  vendor_id: number | string;
  vendor_user_id: number | string;
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

/** Row from GET /api/v1/payments/banks */
export type PayoutBankApi = {
  id: number;
  name: string;
  slug: string;
  code: string;
  longcode: string;
  gateway: string | null;
  pay_with_bank: boolean;
  supports_transfer: boolean;
  available_for_direct_debit: boolean;
  active: boolean;
  country: string;
  currency: string;
  type: 'ghipss' | 'mobile_money' | string;
  is_deleted: boolean;
};

/** Normalized bank row for vendor payout bank transfer */
export type PayoutBankOption = {
  id: number;
  name: string;
  slug: string;
  /** Provider code from API (Paystack / GhIPSS) */
  code: string;
  /** GhIPSS sort code or ExpressPay package code — sent as `bank_code` on process-payment */
  sortCode: string;
};

function isPayoutBankEligible(raw: Record<string, unknown>): boolean {
  if (raw.active === false) return false;
  if (raw.is_deleted === true) return false;
  if (raw.supports_transfer === false) return false;
  const type = String(raw.type ?? '').toLowerCase();
  if (type === 'mobile_money') return false;
  return true;
}

function normalizePayoutBank(raw: Record<string, unknown>): PayoutBankOption {
  const name = String(raw.name ?? raw.bank_name ?? 'Unknown bank').trim();
  const code = String(raw.code ?? raw.bank_code ?? '').trim();
  const longcode = String(raw.longcode ?? '').trim();
  const sortCode = String(
    longcode ||
      raw.sort_code ||
      raw.sortCode ||
      raw.sortcode ||
      raw.package_code ||
      raw.packageCode ||
      code
  ).trim();
  return {
    id: Number(raw.id ?? 0),
    name,
    slug: String(raw.slug ?? ''),
    code,
    sortCode,
  };
}

/** Match vendor on-file bank account to a payout bank sort code */
export function matchPayoutBankCode(
  account: Pick<
    VendorPaymentMethodsBankAccount,
    'bank_name' | 'sort_code' | 'bank_code'
  >,
  options: PayoutBankOption[]
): string {
  const sortOrCode = String(
    account.sort_code ?? account.bank_code ?? ''
  ).trim();
  if (sortOrCode) {
    const byCode = options.find(
      (b) => b.sortCode === sortOrCode || b.code === sortOrCode
    );
    if (byCode) return byCode.sortCode;
  }

  const name = (account.bank_name ?? '').trim().toLowerCase();
  if (!name) return '';

  const byName = options.find((b) => {
    const bankName = b.name.toLowerCase();
    return (
      bankName === name || bankName.includes(name) || name.includes(bankName)
    );
  });
  return byName?.sortCode ?? '';
}

export const getBanks = async (): Promise<PayoutBankOption[]> => {
  const raw = await getMethod<unknown>('payments/banks');
  const list = Array.isArray(raw)
    ? raw
    : ((raw as { data?: unknown[] })?.data ?? []);

  return list
    .filter((item) => isPayoutBankEligible(item as Record<string, unknown>))
    .map((item) => normalizePayoutBank(item as Record<string, unknown>))
    .filter((bank) => Boolean(bank.sortCode))
    .sort((a, b) => a.name.localeCompare(b.name));
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
  id: string;
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
