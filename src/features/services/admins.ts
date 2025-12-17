import {
  deleteMethod,
  getList,
  getMethod,
  patchMethod,
  postMethod,
  putMethod,
} from '@/services';
import type { IAdmin } from '@/types';
import { ROUTES } from '@/utils/constants';

type AdminResponse = {
  admins: IAdmin[];
  currentPage: string;
  totalCount: number;
  totalPages: number;
};

export const getAllAdmins = async (
  query?: Record<string, any>
): Promise<AdminResponse> => {
  const response = await getList(`${ROUTES.ENDPOINT.ADMIN.ROOT}`, query);
  return response;
};
export const getAllArchivedAdmins = async (
  query?: Record<string, any>
): Promise<AdminResponse> => {
  const response = await getList(`${ROUTES.ENDPOINT.ADMIN.ARCHIVED}`, query);
  return response;
};
export const getAdminProfile = async (): Promise<IAdmin> => {
  const response = await getMethod(`${ROUTES.ENDPOINT.ADMIN.PROFILE}`);
  return response;
};

export const inviteAdmin = async (data: any) => {
  const response = await postMethod(`${ROUTES.ENDPOINT.ADMIN.INVITE}`, data);

  return response;
};
export const inviteBulkAdmin = async (data: any) => {
  return await postMethod(`${ROUTES.ENDPOINT.ADMIN.BULK_INVITE}`, data);
};
export const resendInviteAdmin = async (id: string) => {
  const response = await postMethod(`/admin/${id}/resend-invite`);

  return response;
};
export const editAdmin = async (data: any) => {
  const response = await patchMethod(
    `${ROUTES.ENDPOINT.ADMIN.EDIT}/${data.id}`,
    {
      first_name: data.first_name,
      last_name: data.last_name,
      phone_number: data.phone_number,
    }
  );

  return response;
};
export const assignRolesToAdmin = async (data: any) => {
  const response = await putMethod(
    `${ROUTES.ENDPOINT.ADMIN.ASSIGN_ROLES}/${data.id}/roles`,
    { role_ids: data.role_ids }
  );

  return response;
};
export const assignAdminsToRole = async (data: {
  roleId: string;
  admin_ids: string[];
}) => {
  const response = await putMethod(`/admin/roles/${data.roleId}/admins`, {
    admin_ids: data.admin_ids,
  });

  return response;
};
export const reassignRoleAdmins = async (data: {
  admin_ids: string[];
  from_role_id: string;
  to_role_id: string;
}) => {
  const response = await patchMethod(`/admin/roles/reassign`, data);

  return response;
};

export const deleteAdmin = async (id: string) => {
  const response = await deleteMethod(`${'/admin'}/${id}`);
  return response;
};
export const permanentlyDeleteAdmin = async (id: string) => {
  const response = await deleteMethod(`/admin/${id}/hard-delete`);
  return response;
};
export const restoreAdmin = async (id: string) => {
  const response = await postMethod(`/admin/${id}/restore`);
  return response;
};
export const removeRoleFromAdmin = async (payload: {
  adminId: string;
  roleId: string;
}) => {
  const response = await deleteMethod(
    `/admin/roles/admins/${payload.adminId}/roles/${payload.roleId}`
  );
  return response;
};
export const toggleAdminStatus = async (data: {
  id: string;
  status: string;
}) => {
  const response = await putMethod(`${'/admin'}/${data.id}/${data.status}`);
  return response;
};

export const uploadAdminImage = async (adminId: string, fileName: string) => {
  const response = await postMethod(`admin/profile/upload-url/${adminId}`, {
    fileName,
  });
  return response.data;
};
