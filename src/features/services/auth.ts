import { axiosClient } from '@/libs';
import type {
  VendorDetailsResponse,
  UpdateVendorStatusPayload,
  UpdateVendorStatusResponse,
  VendorCardsResponse,
} from '@/types/vendor';
import type {
  CustomersListResponse,
  CustomersQueryParams,
  UpdateCustomerStatusPayload,
  UpdateCustomerStatusResponse,
} from '@/types/customer';
import type {
  AdminRefreshTokenPayload,
  AdminRefreshTokenResponse,
} from '@/types/admin';
import { getList, getMethod, postMethod } from '@/services/requests';
import { ROUTES } from '@/utils/constants/shared';

const adminLogin = async (data: {
  email: string;
  password: string;
}): Promise<any> => {
  return await postMethod(`${ROUTES.ENDPOINT.ADMIN.ROOT}/login`, data);
};

const verifyLoginToken = async (token: string): Promise<any> => {
  return await postMethod(`${ROUTES.ENDPOINT.ADMIN.ROOT}/verify-login-token`, {
    token,
  });
};

const getVendorInfo = async (id: string): Promise<VendorDetailsResponse> => {
  const response = await axiosClient.get(`/vendors/info/${id}`);
  return response.data;
};

const getVendorCards = async (id: string): Promise<VendorCardsResponse> => {
  const response = await axiosClient.get(`/cards/vendor/${id}`);
  return response.data;
};

const updateVendorStatus = async (
  data: UpdateVendorStatusPayload
): Promise<UpdateVendorStatusResponse> => {
  // axiosClient interceptor returns data directly, but TypeScript needs the cast
  const response = await axiosClient.patch('/vendors/status', data);
  return response as unknown as UpdateVendorStatusResponse;
};

const getCustomers = async (
  params?: CustomersQueryParams
): Promise<CustomersListResponse> => {
  // axiosClient interceptor returns data directly, but TypeScript needs the cast
  const response = await axiosClient.get('/users/all', { params });
  return response as unknown as CustomersListResponse;
};

const getAdminInfo = async (id: number): Promise<any> => {
  return await getList(`${ROUTES.ENDPOINT.ADMIN.ROOT}/info/${id}`);
};

const updateCustomerStatus = async (
  data: UpdateCustomerStatusPayload
): Promise<UpdateCustomerStatusResponse> => {
  // axiosClient interceptor returns data directly, but TypeScript needs the cast
  const response = await axiosClient.patch(
    '/users/manage-account-status',
    data
  );
  return response as unknown as UpdateCustomerStatusResponse;
};

const refreshAdminToken = async (
  data: AdminRefreshTokenPayload
): Promise<AdminRefreshTokenResponse> => {
  console.log('[refreshAdminToken] Starting refresh token request', {
    hasRefreshToken: !!data.refresh_token,
    refreshTokenLength: data.refresh_token?.length,
    timestamp: new Date().toISOString(),
  });

  try {
    const response = await axiosClient.post('/admin/refresh-token', data);
    console.log('[refreshAdminToken] Refresh token response received', {
      hasAccessToken: !!response?.data?.accessToken,
      hasRefreshToken: !!response?.data?.refreshToken,
      status: response?.status,
      timestamp: new Date().toISOString(),
    });
    return response as unknown as AdminRefreshTokenResponse;
  } catch (error) {
    console.error('[refreshAdminToken] Refresh token request failed', {
      error,
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
};

const onboardAdmin = async (data: {
  verification_code: string;
  password: string;
}) => {
  const response = await axiosClient.post('/admin/onboard', data);
  return response.data;
};

const getRoles = async (): Promise<any> => {
  return await getList(`/roles/all`);
};

const getPermissions = async (): Promise<any> => {
  return await getList(`/permissions/all`);
};

const getRoleDetails = async (id: string): Promise<any> => {
  return await getMethod(`/roles/single-role/${id}`);
};

const getPermissionDetails = async (id: string): Promise<any> => {
  return await getMethod(`/permissions/single/${id}`);
};

export {
  adminLogin,
  verifyLoginToken,
  getVendorInfo,
  getVendorCards,
  updateVendorStatus,
  getCustomers,
  getAdminInfo,
  updateCustomerStatus,
  refreshAdminToken,
  onboardAdmin,
  getRoles,
  getPermissions,
  getRoleDetails,
  getPermissionDetails,
};
