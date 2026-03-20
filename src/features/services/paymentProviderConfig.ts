import { getMethod, patchMethod } from '@/services';

const commonUrl = '/payment-provider-config';

export const getPaymentProviderConfig = async (): Promise<any> => {
  const response = await getMethod(commonUrl);
  return response?.data || response;
};

export const updatePaymentProviderConfig = async (data: {
  checkout_gateway: string;
  payout_service: string;
}): Promise<any> => {
  return await patchMethod(commonUrl, data);
};

