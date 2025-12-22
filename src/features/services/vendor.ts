import { getList } from '@/services';

const commonUrl = '/vendor-management';

export const getVendorsList = async (): Promise<any> => {
  return await getList(`${commonUrl}/admin/vendors`);
};
