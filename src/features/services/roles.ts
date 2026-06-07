import {
  deleteMethod,
  getList,
  getMethod,
  patchMethod,
  postMethod,
  putMethod,
} from '@/services';

const commonUrl = '/roles';

export type AssignRolePayload = {
  role_id: string;
  admin_id: string;
};

export const getAllRoles = async (query?: Record<string, unknown>): Promise<any> => {
  return await getList(`${commonUrl}/all`, query);
};

export const getSingleRole = async (roleId: string): Promise<any> => {
  return await getMethod(`${commonUrl}/single-role/${roleId}`);
};

export const getAllRolesPermissions = async (): Promise<any> => {
  return await getList(`${commonUrl}/roles-permissions/all`);
};

export const createRole = async (data: {
  role: string;
  description: string;
  permissions: string[];
}): Promise<any> => {
  return await postMethod(`${commonUrl}/create`, data);
};

export const updateRole = async (data: {
  id: string;
  role: string;
  description: string;
  permissions: string[];
}): Promise<any> => {
  return await putMethod(`${commonUrl}/update`, data);
};

export const deleteRole = async (roleId: string): Promise<any> => {
  return await deleteMethod(`${commonUrl}/delete/${roleId}`);
};

export const getRolesCount = async (): Promise<any> => {
  return await getMethod(`${commonUrl}/count`);
};

export const assignRole = async (data: AssignRolePayload): Promise<any> => {
  return await patchMethod(`${commonUrl}/assign-role`, data);
};

export const getRolePermissions = async (roleId: string): Promise<any> => {
  return await getMethod(`${commonUrl}/role-permissions/${roleId}`);
};
