import {
  deleteMethod,
  getList,
  getMethod,
  patchMethod,
  postMethod,
} from '@/services';

const commonUrl = '/roles';

export const getAllRoles = async (): Promise<any> => {
  return await getList(`${commonUrl}/all`);
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
  return await patchMethod(`${commonUrl}/update`, data);
};

export const deleteRole = async (roleId: string): Promise<any> => {
  return await deleteMethod(`${commonUrl}/delete/${roleId}`);
};

export const getRolesCount = async (): Promise<any> => {
  return await getMethod(`${commonUrl}/count`);
};

export const assignRole = async (data: {
  role_id: string;
  admin_id: string;
}): Promise<any> => {
  return await postMethod(`${commonUrl}/assign-role`, data);
};

export const getRolePermissions = async (roleId: string): Promise<any> => {
  return await getMethod(`${commonUrl}/role-permissions/${roleId}`);
};
