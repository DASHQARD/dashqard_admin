import {
  deleteMethod,
  getList,
  patchMethod,
  postMethod,
} from '@/services';
import { axiosClient } from '@/libs/axios';
import { getQueryString } from '@/utils/helpers';

const commonUrl = '/corporate-admin';

export const getSuperAdminInvitations = async (
  query?: Record<string, any>
): Promise<any> => {
  // Use axiosClient directly to get full response with pagination
  // API response structure: { status, statusCode, message, data: [...], pagination: {...} }
  // axiosClient.get() returns the full response object (after interceptor processes it)
  const response = await axiosClient.get(
    `${commonUrl}/super-admin-invitations?${getQueryString(query)}`
  );
  // Return full response structure with data and pagination
  return response;
};

export const createSuperAdminInvitation = async (data: {
  email: string;
  phone_number: string;
  country: string;
  country_code: string;
}): Promise<any> => {
  return await postMethod(`${commonUrl}/create-super-admin`, data);
};

export const deleteSuperAdminInvitation = async (
  id: string
): Promise<any> => {
  return await deleteMethod(`${commonUrl}/super-admin-invitation/${id}`);
};

export const updateSuperAdminInvitationStatus = async (data: {
  id?: string;
  status?: string;
  [key: string]: any;
}): Promise<any> => {
  return await patchMethod(
    `${commonUrl}/update-super-admin-invitation-status`,
    data
  );
};

