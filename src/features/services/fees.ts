import { getMethod, patchMethod } from '@/services';

const commonUrl = '/service-fees';

export const getServiceFees = async (): Promise<any> => {
  const response = await getMethod(commonUrl);
  return response?.data || response;
};

export const updateServiceFees = async (data: {
  service_fee_rate: number;
  vendor_markup_rate: number;
}): Promise<any> => {
  return await patchMethod(commonUrl, data);
};
