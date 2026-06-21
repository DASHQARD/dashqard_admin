export type Vendor = {
  id: string;
  user_id: number;
  branch_manager_name: string;
  branch_manager_email: string;
  branch_name: string;
  branch_location: string;
  is_single_branch: boolean;
  created_at: string;
  updated_at: string;
  vendor_id: number;
  full_branch_id: string;
  gvid: string;
  parent_branch_id: string | null;
  branch_code: string;
  branch_type: string;
  status: string;
  cards: VendorCards[];
  card_count: number;
};

export type VendorsListResponse = {
  status: string;
  statusCode: number;
  message: string;
  data: Vendor[];
  pagination: {
    limit: number;
    hasNextPage: boolean;
    next: string | null;
  };
  url: string;
};

export type VendorsQueryParams = {
  limit?: number;
  status?: string;
  search?: string;
  after?: string;
};

export type VendorDataReference = {
  id: string;
  data_type: string;
  is_copied_from_corporate: boolean;
  requires_approval: boolean;
  approval_status: 'pending' | 'approved' | 'rejected' | 'auto_approved';
};

export type AdminVendorAccount = {
  id: string;
  corporate_user_id: string;
  vendor_user_id: string;
  vendor_id: string | null;
  created_by_user_id: string;
  relationship_type: 'owner_managed' | 'invited';
  approval_status: 'pending' | 'approved' | 'rejected' | 'auto_approved';
  approved_by_admin_id: string | null;
  approved_at: string | null;
  rejection_reason: string | null;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  created_at: string;
  updated_at: string;
  vendor_name: string;
  vendor_email: string;
  vendor_phone: string | null;
  vendor_avatar: string | null;
  vendor_user_type: string;
  vendor_status: string;
  corporate_name: string;
  corporate_email: string;
  business_name: string | null;
  vendor_logo: string | null;
  gvid: string | null;
  onboarding_stage: string | null;
  onboarding_completed: boolean;
  branch_count: number;
  data_references: VendorDataReference[];
};

export type AdminVendorsListResponse = {
  status: string;
  statusCode: number;
  message: string;
  data: AdminVendorAccount[];
  pagination: {
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    next: string | null;
    previous: string | null;
  };
};

export type AdminVendorsQueryParams = {
  limit?: number;
  after?: string;
  status?: 'active' | 'inactive' | 'suspended' | 'pending';
  vendor_status?:
    | 'active'
    | 'inactive'
    | 'suspended'
    | 'pending'
    | 'approved'
    | 'verified';
  approval_status?: 'pending' | 'approved' | 'rejected' | 'auto_approved';
  relationship_type?: 'owner_managed' | 'invited';
  search?: string;
  date_from?: string;
  date_to?: string;
  column?: 'id' | 'created_at' | 'updated_at';
  direction?: 'ASC' | 'DESC';
};

export type VendorDetailsResponse = {
  status: string;
  statusCode: number;
  message: string;
  data: Vendor[];
  pagination: {
    limit: number;
    hasNextPage: boolean;
    next: string | null;
  };
};

export type UpdateVendorStatusPayload = {
  user_id: number;
  status: string;
};

export type UpdateVendorStatusResponse = {
  status: string;
  statusCode: number;
  message: string;
  data?: any;
};

export type VendorDetails = {
  avatar: string | null;
  bank_accounts: any[];
  branches: any[];
  business_details: any;
  business_documents: any[];
  created_at: string;
  default_payment_option: string | null;
  dob: string;
  email: string;
  email_verified: boolean;
  fullname: string;
  id: number;
  id_images: any[];
  id_number: string;
  id_type: string;
  momo_accounts: any[];
  onboarding_stage: string;
  phonenumber: string;
  status: string;
  street_address: string;
  updated_at: string;
  user_type: string;
  vendor_details: any;
};

export type VendorCardsResponse = {
  status: string;
  statusCode: number;
  message: string;
  data: VendorCards[];
};

export type VendorCards = {
  created_at: string;
  created_by: string | null;
  currency: string;
  description: string;
  expiry_date: string;
  fraud_flag: boolean;
  fraud_notes: string | null;
  id: number;
  images: any[];
  is_activated: boolean;
  issue_date: string;
  last_modified_by: string | null;
  price: string;
  product: string;
  rating: number;
  status: string;
  terms_and_conditions: any[];
  type: string;
  updated_at: string;
  vendor_id: number;
  vendor_name: string;
};

export type MobileMoneyAccount = {
  provider?: string;
  number?: string;
};

export type BankAccount = {
  bank_name?: string;
  bank_branch?: string;
  account_name?: string;
  account_number?: string;
  swift_code?: string;
  sort_code?: string;
};

export type VendorBranchCard = {
  card_id: string;
  currency: string;
  card_name: string;
  card_type: string;
  card_price: number;
  card_status: string;
  expiry_date: string;
};

export type BranchWithCards = {
  branch_id: string;
  branch_name: string;
  cards: VendorBranchCard[];
};

export type VendorWithBranchesAndCards = {
  vendor_id: string;
  gvid: string;
  business_name: string;
  business_country: string | null;
  vendor_name: string;
  logo: string | null;
  logo_key: string | null;
  qr_url: string | null;
  updated_at: string;
  branches_with_cards: BranchWithCards[];
};

export type VendorsAllDetailsQueryParams = {
  limit?: number;
  after?: string;
};

export type VendorsAllDetailsResponse = {
  status: string;
  statusCode: number;
  message: string;
  data: VendorWithBranchesAndCards[];
  pagination: {
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    next: string | null;
    previous: string | null;
  };
  url?: string;
};

/** Legacy flat branch row from GET /branches/vendor/:vendor_id */
export type VendorBranchRecord = {
  id: string;
  vendor_id: string;
  gvid: string;
  branch_code: string;
  full_branch_id: string;
  branch_name: string;
  branch_location: string;
  branch_manager_name: string;
  branch_manager_email: string;
  branch_manager_user_id: string;
  user_id: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type VendorBranchesQueryParams = {
  include_related_vendors?: boolean;
};

export type VendorBranchesListResponse = {
  status: string;
  statusCode: number;
  message: string;
  data: VendorBranchRecord[] | VendorWithBranchesAndCards[];
  url?: string;
};

export type VendorPaymentData = {
  branch_id: number;
  branch_location: string;
  created_at: string;
  description: string;
  due_date: string;
  id: number;
  invoice_number: string;
  notes: string | null;
  paid_date: string | null;
  payment_amount: string | number;
  payment_frequency: string;
  payment_method: string | null;
  payment_period: string;
  status: string;
  updated_at: string;
  vendor_gvid: string;
  vendor_id: number;
  vendor_name: string;
  vendor_user_id: number;
  transaction_reference: string;
  bank_code: string;
  bank_name: string;
  bank_branch: string;
  bank_account_name: string;
  bank_account_number: string;
  vendor_preferred_payment_method: string;
};
