export const PERMISSION_MODULES = [
  'Dashboard',
  'Transactions',
  'Savings management',
  'Loan management',
  'Customer management',
  'Agent management',
  'Merchant management',
  'KYC management',
  'Admin management',
  'Audit logs',
  'Notifications',
  'Settings',
] as const;

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
