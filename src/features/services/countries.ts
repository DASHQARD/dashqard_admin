import {
  deleteMethod,
  getMethod,
  patchMethod,
  postMethod,
  putMethod,
} from '@/services';
import { axiosClient } from '@/libs/axios';

const commonUrl = '/countries';

export type CountriesListQuery = {
  limit?: number;
  after?: string;
  search?: string;
  status?: string;
};

export type CountriesListResponse = {
  status?: string;
  statusCode?: number;
  message?: string;
  data?: any[];
  pagination?: {
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
    next?: string | null;
    previous?: string | null;
  };
};

export const getCountriesList = async (
  query?: CountriesListQuery
): Promise<any> => {
  const response = await axiosClient.get<any>(commonUrl, {
    params: query,
  });
  return response;
};

export const getAllCountriesList = async (): Promise<any[]> => {
  const countries: any[] = [];
  let nextCursor: string | undefined;
  let hasNextPage = true;
  const pageLimit = 100;
  let pagesFetched = 0;
  const maxPages = 100;

  while (hasNextPage && pagesFetched < maxPages) {
    const response = await axiosClient.get<CountriesListResponse>(commonUrl, {
      params: {
        limit: pageLimit,
        after: nextCursor,
      },
    });
    const pageData = response.data;

    if (Array.isArray(pageData?.data)) {
      countries.push(...pageData.data);
    }

    hasNextPage = Boolean(pageData?.pagination?.hasNextPage);
    nextCursor = pageData?.pagination?.next ?? undefined;
    pagesFetched += 1;
  }

  return countries;
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
