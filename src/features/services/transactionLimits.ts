import { getMethod, patchMethod } from '@/services';

const commonUrl = '/transaction-limits';

export const getTransactionLimits = async (): Promise<any> => {
  const response = await getMethod(commonUrl);
  return response?.data || response;
};

export const updateTransactionLimits = async (data: any): Promise<any> => {
  return await patchMethod(commonUrl, data);
};

