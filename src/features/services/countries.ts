import {
  deleteMethod,
  getMethod,
  patchMethod,
  postMethod,
  putMethod,
} from '@/services';

const commonUrl = '/countries';

export const getCountriesList = async (): Promise<any> => {
  const response = await getMethod(commonUrl);
  // Response structure: { status, statusCode, message, data: [...], pagination: {...} }
  // Extract the data array from the response
  return response?.data || response;
};

export const getCountryById = async (id: string): Promise<any> => {
  return await getMethod(`${commonUrl}/id/${id}`);
};

export const getCountryByCode = async (code: string): Promise<any> => {
  return await getMethod(`${commonUrl}/code/${code}`);
};

export const getCountryByIso = async (isoCode: string): Promise<any> => {
  return await getMethod(`${commonUrl}/iso/${isoCode}`);
};

export const createCountry = async (data: {
  code: string;
  iso_code: string;
  name: string;
  currency: string;
}): Promise<any> => {
  return await postMethod(commonUrl, data);
};

export const updateCountry = async (
  id: string,
  data: {
    code: string;
    iso_code: string;
    name: string;
    currency: string;
    status: string;
  }
): Promise<any> => {
  return await putMethod(`${commonUrl}/${id}`, data);
};

export const deleteCountry = async (id: string): Promise<any> => {
  return await deleteMethod(`${commonUrl}/${id}`);
};

export const updateCountryStatus = async (
  id: string,
  data?: any
): Promise<any> => {
  return await patchMethod(`${commonUrl}/${id}/status`, data);
};

