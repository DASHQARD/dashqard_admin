import type { PermissionType } from './roles';
import type { FileType, TierType } from './shared';

export interface IAdmin {
  id: string;
  email: string;
  first_name: string;
  full_name: string;
  isDeleted: boolean;
  isSuperAdmin: boolean;
  last_name: string;
  phone_number: string;
  profileImage: string | null;
  roles: {
    id: string;
    name: string;
    permissions: PermissionType[];
  }[];
  status: 'active' | 'deactivated' | 'pending';
  lastLogin: string;
}

export interface IAgentGuarantor {
  id: string;
  name: string;
  contact: string;
}

type UpgradeRequirements = {
  tier_2: {
    target_tier: '1' | '2' | '3';
    upgrade_type: string;
    required_verifications: string[];
    current_status: {
      bvn_verified: boolean;
      nin_verified: boolean;
      liveness_check_passed: boolean;
    };
    can_upgrade: boolean;
    next_steps: string[];
    eligible_for_auto_upgrade: boolean;
  };
  tier_3: {
    target_tier: '1' | '2' | '3';
    upgrade_type: string;
    required_verifications: string[];
    current_status: {
      address_verified: boolean;
    };
    pending_request: any;
    rejection_info: {
      is_rejected: boolean;
      reason: string;
      rejected_at: string;
      can_resubmit_after: string;
    };
    can_upgrade: boolean;
    next_steps: string[];
    eligible_for_manual_review: string;
  };
};

export interface ICustomerProfile {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  address: string | null;
  registration_date: string;
  date_joined: string;
  tier: TierType;
  status: string;
  kyc_status: string;
  wallet_balance: string;
  wallet_active: boolean;
  nin: string;
  bvn: string;
  lga: string | null;
  state: string | null;
  gender: string | null;
  address_document_type: string | null;
  requested_daily_transaction_limit: string | null;
  is_phone_verified: boolean;
  bvn_verified: boolean;
  nin_verified: boolean;
  liveness_check_passed: boolean;
  address_verified: boolean;
  tier_upgrade_rejection_reason: string | null;
  tier_upgrade_rejected_at: string | null;
  uploaded_documents: FileType[];
  user_type: 'individual' | 'merchant' | 'agent';
  business_name: string;
  business_type: string;
  cac_number: string;
  is_archived: boolean;
  agent_cac_number: string | null;
  agent_type_of_business: string | null;
  tin_number: string | null;
  requested_daily_limit: string | null;
  business_address: string;
  business_address_type: string;
  business_address_document_url: string;
  tier_approval_status: string;
  latest_tier_upgrade_request: Record<string, any> | null;
  latest_address_upgrade_request: {
    request_id: string;
    status: string;
    type: string;
    target_tier: TierType;
    created_at: string;
    reviewed_at: string | null;
    reviewed_by: string | null;
    rejection_reason: string | null;
    business_address: string;
  };
  latest_tier3_upgrade_request: Record<string, any>;
  upgrade_requirements?: UpgradeRequirements;
  estimated_transaction_volume: string | null;
  business_duration: string | null;
  tax_id: string | null;
  business_agreement_form: string | null;
  proof_of_address: string | null;
  address_document_url: string | null;
  is_deleted: boolean;
  guarantors: IAgentGuarantor[];
  approved_limit?: number;
  individual_savings_totals: {
    total_contributions: number;
    current_balance: number;
    active_savings_count: number;
  };
  ajo_savings_totals: {
    total_contributions: number;
    total_payouts_received: number;
    active_groups_count: number;
  };
  group_savings_totals: {
    total_contributions: number;
    current_balance: number;
    active_groups_count: number;
  };
}

export type AllAdminsType = {
  roles: {
    created_at: string;
    updated_at: string;
    id: string;
    name: string;
    description: string;
    status: string;
    permissions: string[];
  }[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
