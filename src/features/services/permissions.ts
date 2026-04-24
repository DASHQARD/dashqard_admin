import { axiosClient } from '@/libs/axios';
import { deleteMethod, getMethod, patchMethod, postMethod } from '@/services';
import { getQueryString } from '@/utils/helpers';

const commonUrl = '/permissions';

export type PermissionsQueryParams = {
  limit?: number;
  after?: string | number;
  search?: string;
};

export type PermissionsListResponse = {
  data?: any[];
  pagination?: {
    hasNextPage?: boolean;
    next?: string | null;
  };
};

/**
 * Full list response includes `data` and `pagination` (do not use getList — it only returns `data`).
 */
export const getAllPermissions = async (
  query?: PermissionsQueryParams
): Promise<any> => {
  const qs = getQueryString(query as Record<string, any>);
  const url = qs ? `${commonUrl}/all?${qs}` : `${commonUrl}/all`;
  return await axiosClient.get(url);
};

export const getAllPermissionsList = async (): Promise<any[]> => {
  const permissions: any[] = [];
  let hasNextPage = true;
  let nextCursor: string | undefined;
  const pageLimit = 100;
  let pagesFetched = 0;
  const maxPages = 100;

  while (hasNextPage && pagesFetched < maxPages) {
    const response = await axiosClient.get<PermissionsListResponse>(
      `${commonUrl}/all`,
      {
        params: {
          limit: pageLimit,
          after: nextCursor,
        },
      }
    );
    const pageData = response.data;

    if (Array.isArray(pageData?.data)) {
      permissions.push(...pageData.data);
    }

    hasNextPage = Boolean(pageData?.pagination?.hasNextPage);
    nextCursor = pageData?.pagination?.next ?? undefined;
    pagesFetched += 1;
  }

  return permissions;
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
