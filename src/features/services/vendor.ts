import { getList, patchMethod } from '@/services';

const commonUrl = '/vendor-management';

export const getVendorsList = async (): Promise<any> => {
  return await getList(`${commonUrl}/admin/vendors`);
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
