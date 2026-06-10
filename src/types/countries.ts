export type CountryStatus = 'active' | 'inactive';

export type Country = {
  id: number;
  code: string;
  iso_code: string;
  name: string;
  currency: string;
  status: CountryStatus;
  created_at: string;
  updated_at: string;
};

export type CountriesPagination = {
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  next: string | null;
  previous: string | null;
};

export type CountriesListQuery = {
  limit?: number;
  after?: string;
  search?: string;
  status?: CountryStatus;
  currency?: string;
};

export type CountriesListResponse = {
  status: string;
  statusCode: number;
  message: string;
  data: Country[];
  pagination: CountriesPagination;
};

export type CountryResponse = {
  status: string;
  statusCode: number;
  message: string;
  data: Country;
};

export type CreateCountryPayload = {
  code: string;
  iso_code: string;
  name: string;
  currency: string;
};

export type UpdateCountryPayload = {
  code?: string;
  iso_code?: string;
  name?: string;
  currency?: string;
  status?: CountryStatus;
};

export type UpdateCountryStatusPayload = {
  status: CountryStatus;
};
