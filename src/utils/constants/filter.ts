export const ADMIN_TYPES = [
  { label: 'Super Admin', value: 'super_admin' },
  { label: 'Admin', value: 'admin' },
];

export const OPTIONS = {
  CUSTOMER_MANAGEMENT_STATUS: [
    'active',
    'approved',
    'suspended',
    'inactive',
    'pending',
    'verified',
  ],
  CORPORATE_MANAGEMENT_STATUS: [
    'active',
    'approved',
    'pending',
    'deactivated',
    'inactive',
  ],
  VENDOR_ACCOUNT_STATUS: [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Suspended', value: 'suspended' },
    { label: 'Pending', value: 'pending' },
  ],
  VENDOR_USER_STATUS: [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Suspended', value: 'suspended' },
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Verified', value: 'verified' },
  ],
  VENDOR_APPROVAL_STATUS: [
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Auto approved', value: 'auto_approved' },
  ],
  VENDOR_RELATIONSHIP_TYPE: [
    { label: 'Owner managed', value: 'owner_managed' },
    { label: 'Invited', value: 'invited' },
  ],
  ADMIN_STATUS: ['active', 'deactivated', 'pending'],
  AGENT_STATUS: ['active', 'deactivated', 'inactive'],
  AGENT_TIER: ['A1', 'A2', 'A3'],
  CUSTOMER_STATUS: [
    'active',
    'deactivated',
    'inactive',
    'pending_registration',
  ],

  TRANSACTION_STATUS: [
    'pending',
    'processing',
    'failed',
    'successful',
    'cancelled',
  ],
  DATE_RANGE: ['daily', 'weekly', 'monthly', 'all time'],
  SAVINGS_STATUS: ['pending', 'ongoing', 'completed'],
  USER_TYPE: ['individual', 'agent', 'merchant'],
  TRANSACTION_TYPE: ['credit', 'debit'],
  VENDOR_PAYMENT_STATUS: ['pending', 'paid', 'overdue'],
  VENDOR_PAYMENT_FREQUENCY: ['daily', 'weekly', 'bi-weekly', 'monthly'],
  SUPER_ADMIN_INVITATIONS_STATUS: ['pending', 'accepted'],
  PAYMENT_STATUS: ['pending', 'paid'],
  REQUEST_STATUS: [
    'awaiting admin approval',
    'pending',
    'approved',
    'rejected',
  ],
};

/** Shared PaginatedTable date-range filter config (query keys: date_from / date_to). */
export const DATE_RANGE_FILTER = [
  { queryKey: 'date_from' as const, label: 'Date range' },
];
