import { getList, patchMethod } from '@/services';

const commonUrl = '/vendor-management';

export const getVendorsList = async (): Promise<any> => {
  return await getList(`${commonUrl}/admin/vendors`);
};

export const getVendorDetails = async (id: string | number): Promise<any> => {
  const response = await getList(`${commonUrl}/vendor/${id}`);
  return response?.data || response;
};

export const getVendorQrCode = async (id: string | number): Promise<any> => {
  const response = await getList(`${commonUrl}/qr-code/${id}`);
  return response?.data || response;
};

export const approveVendor = async (data: {
  vendor_account_id: number;
  approval_status: 'approved' | 'rejected';
  rejection_reason?: string;
}): Promise<any> => {
  return await patchMethod(`${commonUrl}/admin/approve`, data);
};

export const updateVendorAccountStatus = async (data: {
  vendor_account_id: number;
  status: 'active' | 'inactive';
}): Promise<any> => {
  return await patchMethod(`${commonUrl}/status`, data);
};

export const removeVendorAdmin = async (data: {
  vendor_user_id: number;
  password: string;
}): Promise<any> => {
  return await patchMethod(`${commonUrl}/remove-vendor-admin`, data);
};
