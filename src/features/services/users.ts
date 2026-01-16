import { getList, getMethod, patchMethod } from '@/services/requests';

const commonUrl = '/users';

export const getAllUsers = async (
  query?: Record<string, any>
): Promise<any> => {
  return await getList(`${commonUrl}/all`, query);
};

export const getUserInfo = async (id: string | number): Promise<any> => {
  return await getMethod(`${commonUrl}/info`, id.toString());
};

export const manageUserAccountStatus = async (data: {
  user_id: number;
  status: string;
}): Promise<any> => {
  return await patchMethod(`${commonUrl}/manage-account-status`, data);
};

export const getOnboardingProgress = async (): Promise<any> => {
  return await getMethod(`${commonUrl}/onboarding-progress`);
};

export const getUserOnboardingProgress = async (
  id: string | number
): Promise<any> => {
  return await getMethod(`${commonUrl}/onboarding-progress`, id.toString());
};
