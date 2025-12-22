// Permission categories from API
export const PERMISSION_CATEGORIES = [
  'users',
  'roles',
  'admins',
  'vendors',
  'countries',
  'fees',
  'transaction_limits',
  'audit_logs',
  'payments',
  'ticket_supports',
  'corporates',
] as const;

// Permission actions from API
export const PERMISSION_ACTIONS = [
  'management',
  'view',
  'create',
  'update',
  'delete',
  'get',
  'manage',
] as const;

// Permission modules - updated to match API categories with display-friendly names
// These map to PERMISSION_CATEGORIES from the API
export const PERMISSION_MODULES = [
  'Dashboard', // UI-specific, not in API but may be used for navigation
  'Users', // maps to 'users' category
  'Roles', // maps to 'roles' category
  'Admins', // maps to 'admins' category
  'Vendors', // maps to 'vendors' category
  'Countries', // maps to 'countries' category
  'Fees', // maps to 'fees' category
  'Transaction Limits', // maps to 'transaction_limits' category
  'Audit Logs', // maps to 'audit_logs' category
  'Payments', // maps to 'payments' category
  'Ticket Supports', // maps to 'ticket_supports' category
  'Corporates', // maps to 'corporates' category
  // Legacy modules (kept for backward compatibility)

  'Notifications',
  'Settings',
] as const;

// Legacy permission keys (for backward compatibility)
export const PERMISSION_KEYS = [
  'view',
  'create',
  'edit',
  'delete',
  'export',
  'approve/reject',
  'deactivate/activate',
] as const;

export const DISABLE_PERMISSION_MODULES = [
  'Dashboard create',
  'Dashboard delete',
  'Dashboard approve/reject',
  'Dashboard deactivate/activate',
  'Admin management approve/reject',

  'Transactions create',
  'Transactions edit',
  'Transactions delete',
  'Transactions approve/reject',
  'Transactions deactivate/activate',

  'Wallet management create',
  'Wallet management delete',
  'Wallet management approve/reject',

  'KYC management create',
  'KYC management edit',
  'KYC management delete',
  'KYC management deactivate/activate',
  'KYC management export',

  'Audit logs create',
  'Audit logs edit',
  'Audit logs delete',
  'Audit logs approve/reject',
  'Audit logs deactivate/activate',
];

export const ALL_ROLES_AND_PERMISSIONS = PERMISSION_MODULES.map((module) => ({
  module,
  ...{
    view: 'view',
    create: 'create',
    edit: 'edit',
    delete: 'delete',
    export: 'export',
    'approve/reject': 'approve/reject',
    'deactivate/activate': 'deactivate/activate',
  },
}));
