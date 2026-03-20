import { getMethod, patchMethod } from '@/services';

const commonUrl = '/card-configurations';

export const getCardConfigurations = async (): Promise<any> => {
  const response = await getMethod(commonUrl);
  return response?.data || response;
};

export const updateCardConfigurations = async (data: {
  min_card_amount: number;
}): Promise<any> => {
  return await patchMethod(commonUrl, data);
};

