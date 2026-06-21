/** Query string for GET /vendor-payments/admin/vendors/:vendor_id/branches */
export type AdminVendorBranchesQueryParams = {
  limit?: number;
  after?: string;
  status?: string;
  payment_frequency?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
};

export type AdminVendorBranchPaymentSummary = {
  paid_count: number;
  total_paid: number;
  grand_total: number;
  total_count: number;
  overdue_count: number;
  pending_count: number;
  total_overdue: number;
  total_pending: number;
};

/** Single branch row from GET /vendor-payments/admin/vendors/:vendor_id/branches */
export type AdminVendorBranch = {
  id: string;
  user_id: number;
  vendor_id: number;
  gvid: string;
  branch_manager_name: string;
  branch_manager_email: string;
  branch_name: string;
  branch_location: string;
  full_branch_id: string;
  branch_code: string;
  branch_type: string;
  parent_branch_id: string | null;
  created_at: string;
  updated_at: string;
  branch_manager_user_id: number;
  payment_summary: AdminVendorBranchPaymentSummary;
};

/** Response body for GET /vendor-payments/admin/vendors/:vendor_id/branches */
export type AdminVendorBranchesListResponse = {
  status: string;
  statusCode: number;
  message: string;
  data: AdminVendorBranch[];
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  next: string | null;
  previous: string | null;
  url?: string;
};
