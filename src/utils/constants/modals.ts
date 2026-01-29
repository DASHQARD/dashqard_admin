export const MODALS = {
  REQUEST_CORPORATE_MANAGEMENT: {
    PARAM_NAME: 'request-corporate',
    CHILDREN: {
      APPROVE: 'approve',
      REJECT: 'reject',
      VIEW: 'view',
      DELETE: 'delete',
    },
  },
  REQUEST_VENDOR_MANAGEMENT: {
    PARAM_NAME: 'request-vendor-management-modal',
    CHILDREN: {
      VIEW: 'view-request-vendor',
      APPROVE: 'approve-request-vendor',
      REJECT: 'reject-request-vendor',
      DELETE: 'delete-request-vendor',
    },
  },
  ADMIN_MANAGEMENT: {
    ROOT: 'admin-management-modal',
    VIEW: 'view-admin',
    EDIT: 'edit-admin',
    DEACTIVATE: 'deactivate-admin',
    ACTIVATE: 'activate-admin',
    FREEZE: 'freeze-wallet',
    UNFREEZE: 'unfreeze-wallet',
    DELETE: 'delete-admin',
  },
  CORPORATE_MANAGEMENT: {
    PARAM_NAME: 'corporate',
    CHILDREN: {
      VIEW: 'view',
      TRANSACTIONS: 'transactions',
      EDIT: 'edit',
      DEACTIVATE: 'deactivate',
      ACTIVATE: 'activate',
      DELETE: 'delete',
      KYC: 'kyc',
      VIEW_KYC_DOCUMENT: 'view-kyc-document',
      VIEW_BUSINESS_INFORMATION: 'view-business-information',
    },
  },
  VENDOR_MANAGEMENT: {
    PARAM_NAME: 'vendor-management-modal',
    CHILDREN: {
      VIEW: 'view-vendor',
      EDIT: 'edit-vendor',
      DEACTIVATE: 'deactivate-vendor',
      ACTIVATE: 'activate-vendor',
      DELETE: 'delete-vendor',
      APPROVE: 'approve-vendor',
      VIEW_KYC_DOCUMENT: 'view-vendor-kyc-document',
    },
  },
  PAYMENT: {
    ROOT: 'payment-modal',
    VIEW: 'view-payment',
  },
  CUSTOMER: {
    ROOT: 'customer-modal',
    VIEW: 'view-customer',
    DEACTIVATE: 'deactivate-customer',
    ACTIVATE: 'activate-customer',
    FREEZE: 'freeze-wallet',
    UNFREEZE: 'unfreeze-wallet',
    DELETE: 'delete-customer',
  },
  ADMIN: {
    ROOT: 'admin-modal',
    PARAM_NAME: 'admin-modal',
    VIEW: 'view-admin',
    EDIT: 'edit-admin',
    CREATE: 'invite-admin',
    BULK_INVITE: 'bulk-invite-admin',
    BULK_INVITE_PREVIEW: 'bulk-invite-admin-preview',
    REMOVE: 'delete-admin',
    TOGGLE_STATUS: 'toggle-admin-status',
    RESEND_INVITE: 'resend-admin-invite',
    RESTORE: 'restore-admin',
    PERMANENTLY_DELETE: 'permanently-delete-admin',
  },
  PERMISSIONS_MANAGEMENT: {
    PARAM_NAME: 'permissions-management-modal',
    CHILDREN: {
      CREATE: 'create-permission',
      EDIT: 'edit-permission',
      DELETE: 'delete-permission',
    },
  },
  ROLES_MANAGEMENT: {
    PARAM_NAME: 'roles-management-modal',
    CHILDREN: {
      CREATE: 'create-role',
      EDIT: 'edit-role',
      DELETE: 'delete-role',
      VIEW: 'view-role',
      ASSIGN: 'assign-role',
    },
  },
  COUNTRIES_MANAGEMENT: {
    PARAM_NAME: 'countries-management-modal',
    CHILDREN: {
      CREATE: 'create-country',
      EDIT: 'edit-country',
      DELETE: 'delete-country',
      UPDATE_STATUS: 'update-country-status',
    },
  },
  TICKETS_MANAGEMENT: {
    PARAM_NAME: 'tickets-management-modal',
    CHILDREN: {
      CREATE: 'create-ticket',
      VIEW: 'view-ticket',
      UPDATE_STATUS: 'update-ticket-status',
    },
  },
  PAYMENT_DETAILS_MANAGEMENT: {
    PARAM_NAME: 'payment-details-management-modal',
    CHILDREN: {
      DELETE: 'delete-payment-detail',
    },
  },
  PAYMENTS_MANAGEMENT: {
    PARAM_NAME: 'payments-management-modal',
    CHILDREN: {
      VIEW: 'view-payment',
      UPDATE_STATUS: 'update-payment-status',
      DELETE: 'delete-payment',
    },
  },
  VENDOR_PAYMENT_MANAGEMENT: {
    PARAM_NAME: 'vendor-payment-modal',
    CHILDREN: {
      VIEW: 'view-vendor-payment',
      CREATE: 'create-vendor-payment',
      UPDATE: 'update-vendor-payment',
      DELETE: 'delete-vendor-payment',
      DOWNLOAD_INVOICE: 'download-invoice',
      PREFERENCES: 'preferences',
      MANAGE_PREFERENCES: 'manage-payment-preferences',
    },
  },
  SUPER_ADMIN_INVITATIONS_MANAGEMENT: {
    PARAM_NAME: 'super-admin-invitations-management-modal',
    CHILDREN: {
      CREATE: 'create-super-admin-invitation',
      DELETE: 'delete-super-admin-invitation',
      UPDATE_STATUS: 'update-super-admin-invitation-status',
    },
  },
};
