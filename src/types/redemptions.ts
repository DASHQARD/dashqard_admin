import type { CardFileResponse, CardImageResponse } from './cards';

export type VendorCatalogBranch = {
  id: string;
  branch_name: string;
  branch_location: string;
  branch_code: string;
  full_branch_id: string;
  gvid: string;
};

export type VendorCatalogVendor = {
  vendor_id: string;
  vendor_name: string;
  gvid: string;
  qr_code_url: string;
  branches: VendorCatalogBranch[];
};

export type RedemptionBranch = {
  branch_id: string;
  branch_name: string;
  branch_location: string;
  branch_code?: string;
  full_branch_id?: string;
  gvid?: string;
};

export type VendorCatalogCard = {
  id: string;
  type: string;
  product: string;
  description: string;
  amount: number;
  base_price: number;
  markup_amount: number;
  currency: string;
  status: string;
  issue_date: string;
  expiry_date: string;
  created_at: string;
  updated_at: string;
  created_by_name: string;
  images: CardImageResponse[];
  terms_and_conditions: CardFileResponse[];
  redemption_branches: RedemptionBranch[];
};

export type VendorCatalogQueryParams = {
  limit?: number;
  after?: string;
};

export type VendorCatalogResponse = {
  status: string;
  statusCode: number;
  message: string;
  data: {
    vendor: VendorCatalogVendor;
    cards: VendorCatalogCard[];
  };
  pagination: {
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    next: string | null;
    previous: string | null;
  };
  url?: string;
};
