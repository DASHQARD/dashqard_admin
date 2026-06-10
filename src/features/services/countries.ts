import {
  deleteMethod,
  getMethod,
  patchMethod,
  postMethod,
  putMethod,
} from '@/services';
import { axiosClient } from '@/libs/axios';
import type {
  CountriesListQuery,
  CountriesListResponse,
  Country,
  CreateCountryPayload,
  UpdateCountryPayload,
  UpdateCountryStatusPayload,
} from '@/types/countries';

const commonUrl = '/countries';

/** Omit empty query values — the API rejects empty params with 400. */
export function sanitizeCountriesListQuery(
  query?: CountriesListQuery
): Record<string, string | number> {
  const params: Record<string, string | number> = {};

  const limit = query?.limit;
  if (limit != null && limit >= 1 && limit <= 100) {
    params.limit = limit;
  } else {
    params.limit = 10;
  }

  const after = query?.after?.trim();
  if (after) params.after = after;

  const search = query?.search?.trim();
  if (search) params.search = search;

  if (query?.status === 'active' || query?.status === 'inactive') {
    params.status = query.status;
  }

  const currency = query?.currency?.trim().toUpperCase();
  if (currency && currency.length === 3) {
    params.currency = currency;
  }

  return params;
}

export const getCountriesList = async (
  query?: CountriesListQuery
): Promise<CountriesListResponse> => {
  const response = await axiosClient.get(commonUrl, {
    params: sanitizeCountriesListQuery(query),
  });
  return response as unknown as CountriesListResponse;
};

async function fetchAllCountriesPages(
  query?: CountriesListQuery
): Promise<Country[]> {
  const countries: Country[] = [];
  let nextCursor: string | undefined;
  let hasNextPage = true;
  let pagesFetched = 0;
  const maxPages = 100;

  while (hasNextPage && pagesFetched < maxPages) {
    const response = await getCountriesList({
      ...query,
      limit: query?.limit ?? 100,
      after: nextCursor,
    });

    if (Array.isArray(response?.data)) {
      countries.push(...response.data);
    }

    hasNextPage = Boolean(response?.pagination?.hasNextPage);
    nextCursor = response?.pagination?.next ?? undefined;
    pagesFetched += 1;
  }

  return countries;
}

/** All countries (admin lists, exhaustive pickers). */
export const getAllCountriesList = async (): Promise<Country[]> => {
  return fetchAllCountriesPages({ limit: 100 });
};

/** Active countries only — use for signup / phone / business pickers. */
export const getActiveCountriesList = async (): Promise<Country[]> => {
  return fetchAllCountriesPages({ status: 'active', limit: 100 });
};

export const getCountryById = async (id: string | number): Promise<Country> => {
  return await getMethod<Country>(`${commonUrl}/id/${id}`);
};

export const getCountryByCode = async (code: string): Promise<Country> => {
  return await getMethod<Country>(`${commonUrl}/code/${code}`);
};

export const getCountryByIso = async (isoCode: string): Promise<Country> => {
  return await getMethod<Country>(
    `${commonUrl}/iso/${isoCode.trim().toUpperCase()}`
  );
};

export const createCountry = async (
  data: CreateCountryPayload
): Promise<Country> => {
  const res = await postMethod(commonUrl, {
    code: data.code.trim(),
    iso_code: data.iso_code.trim().toUpperCase(),
    name: data.name.trim(),
    currency: data.currency.trim().toUpperCase(),
  });
  return res?.data ?? res;
};

export const updateCountry = async (
  id: string | number,
  data: UpdateCountryPayload
): Promise<Country> => {
  const payload: UpdateCountryPayload = {};
  if (data.code != null) payload.code = data.code.trim();
  if (data.iso_code != null) {
    payload.iso_code = data.iso_code.trim().toUpperCase();
  }
  if (data.name != null) payload.name = data.name.trim();
  if (data.currency != null) {
    payload.currency = data.currency.trim().toUpperCase();
  }
  if (data.status === 'active' || data.status === 'inactive') {
    payload.status = data.status;
  }
  const res = await putMethod(`${commonUrl}/${id}`, payload);
  return res?.data ?? res;
};

export const deleteCountry = async (
  id: string | number
): Promise<{ deleted: boolean }> => {
  const res = await deleteMethod(`${commonUrl}/${id}`);
  return res?.data ?? res;
};

export const updateCountryStatus = async (
  id: string | number,
  data: UpdateCountryStatusPayload
): Promise<Country> => {
  const res = await patchMethod(`${commonUrl}/${id}/status`, data);
  return res?.data ?? res;
};
