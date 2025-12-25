import {
  deleteMethod,
  getList,
  getMethod,
  patchMethod,
  postMethod,
} from '@/services';

const commonUrl = '/permissions';

export const getAllPermissions = async (): Promise<any> => {
  return await getList(`${commonUrl}/all`);
};

export const getSinglePermission = async (
  permissionId: string
): Promise<any> => {
  return await getMethod(`${commonUrl}/single/${permissionId}`);
};

export const createPermissions = async (data: {
  permissions: Array<{
    permission: string;
    category: string;
    description: string;
  }>;
}): Promise<any> => {
  return await postMethod(`${commonUrl}/new/create`, data);
};

export const updatePermissions = async (data: {
  permissions: Array<{
    permission: string;
    category: string;
    description: string;
  }>;
}): Promise<any> => {
  return await patchMethod(`${commonUrl}/update`, data);
};

export const deletePermission = async (permissionId: string): Promise<any> => {
  return await deleteMethod(`${commonUrl}/delete/${permissionId}`);
};

export const getPermissionRole = async (permissionId: string): Promise<any> => {
  return await getMethod(`${commonUrl}/role/${permissionId}`);
};
