import { axiosClient } from '@/libs';
import type {
  VendorDetailsResponse,
  UpdateVendorStatusPayload,
  UpdateVendorStatusResponse,
  VendorCardsResponse,
} from '@/types/vendor';
import type {
  UpdateCustomerStatusPayload,
  UpdateCustomerStatusResponse,
} from '@/types/customer';
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

const getCustomers = async (query?: Record<string, any>): Promise<any> => {
  return await getList('/users/all', query);
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

const refreshToken = async (refreshToken: string) => {
  return await postMethod(`/admin/refresh-token`, {
    refresh_token: refreshToken,
  });
};

export {
  adminLogin,
  verifyLoginToken,
  getVendorInfo,
  getVendorCards,
  updateVendorStatus,
  getCustomers,
  updateCustomerStatus,
  onboardAdmin,
  getRoles,
  getPermissions,
  getRoleDetails,
  getPermissionDetails,
  refreshToken,
};
