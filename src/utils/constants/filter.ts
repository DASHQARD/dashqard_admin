export const ADMIN_TYPES = [
  { label: 'Super Admin', value: 'super_admin' },
  { label: 'Admin', value: 'admin' },
];

export const OPTIONS = {
  CORPORATE_MANAGEMENT_STATUS: ['active', 'deactivated', 'inactive'],
  VENDOR_MANAGEMENT_STATUS: ['active', 'deactivated', 'inactive'],
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
  VENDOR_PAYMENT_FREQUENCY: ['daily', 'weekly', 'monthly', 'bi-weekly'],
};
