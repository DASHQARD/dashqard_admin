import { ROUTES } from './shared';

export const ADMIN_NAV_ITEMS = [
  {
    section: 'Overview',
    items: [
      {
        path: ROUTES.IN_APP.ADMIN.HOME,
        label: 'Dashboard',
        icon: 'bi:speedometer2',
        permission: undefined,
      },
    ],
  },
  {
    section: 'User Management',
    items: [
      {
        path: ROUTES.IN_APP.ADMIN.CUSTOMERS,
        label: 'Customers',
        icon: 'bi:people-fill',
        permission: 'users:management',
      },
      {
        path: ROUTES.IN_APP.ADMIN.VENDORS,
        label: 'Vendors',
        icon: 'bi:shop',
        permission: 'vendors:view',
        children: [
          {
            path: ROUTES.IN_APP.ADMIN.REQUESTS.VENDOR_REQUESTS,
            label: 'Vendor Requests',
            icon: 'bi:shop',
            permission: 'requests:view',
          },
          {
            path: ROUTES.IN_APP.ADMIN.VENDOR_PAYMENTS,
            label: 'Vendor Payments',
            icon: 'bi:wallet2',
            permission: 'vendor_payments:get',
          },
          {
            path: ROUTES.IN_APP.ADMIN.VENDOR_BRANCHES,
            label: 'Branches',
            icon: 'bi:shop',
            permission: 'vendors:view',
          },
        ],
      },
      {
        path: ROUTES.IN_APP.ADMIN.CORPORATES,
        label: 'Cooperate',
        icon: 'bi:building',
        permission: 'corporates:view',
        children: [
          {
            path: ROUTES.IN_APP.ADMIN.REQUESTS.CORPORATE_REQUESTS,
            label: 'Corporate Requests',
            icon: 'bi:building',
            permission: 'requests:view',
          },
        ],
      },
    ],
  },
  {
    section: 'Configuration',
    items: [
      {
        path: ROUTES.IN_APP.ADMIN.COUNTRIES,
        label: 'Countries',
        icon: 'bi:globe',
        permission: 'countries:management',
      },
      {
        path: ROUTES.IN_APP.ADMIN.FEES,
        label: 'Fees',
        icon: 'bi:currency-dollar',
        permission: 'fees:view',
      },
      {
        path: ROUTES.IN_APP.ADMIN.CARD_CONFIGURATIONS,
        label: 'Card Configurations',
        icon: 'bi:credit-card',
        permission: 'card_configurations:view',
      },
      {
        path: ROUTES.IN_APP.ADMIN.PAYMENT_PROVIDER_CONFIG,
        label: 'Payment Providers',
        icon: 'bi:credit-card',
        permission: 'payments:view',
      },
    ],
  },
  {
    section: 'Admin Management',
    items: [
      {
        path: ROUTES.IN_APP.ADMIN.ADMINS,
        label: 'Admins',
        icon: 'bi:person-check-fill',
        permission: 'admins:get',
      },
      {
        path: ROUTES.IN_APP.ADMIN.SUPER_ADMIN_INVITATIONS,
        label: 'Corporate Invitations',
        icon: 'bi:envelope-plus',
        permission: 'admins:get',
      },
      {
        path: ROUTES.IN_APP.ADMIN.ROLES,
        label: 'Roles & Permissions',
        icon: 'bi:shield-lock-fill',
        permission: 'roles:get',
      },
    ],
  },
  {
    section: 'Payments',
    items: [
      {
        path: ROUTES.IN_APP.ADMIN.PAYMENTS,
        label: 'Payment',
        icon: 'bi:receipt',
        permission: 'payments:view',
      },
    ],
  },
  {
    section: 'Transactions',
    items: [
      {
        path: ROUTES.IN_APP.ADMIN.TRANSACTION_LIMITS,
        label: 'Transaction Limits',
        icon: 'bi:currency-exchange',
        permission: 'transaction_limits:view',
      },
    ],
  },
  {
    section: 'Settings & Support',
    items: [
      {
        path: ROUTES.IN_APP.ADMIN.PROFILE,
        label: 'Profile',
        icon: 'bi:person-circle',
        permission: undefined, // Profile is accessible to all logged-in users
      },
      {
        path: ROUTES.IN_APP.ADMIN.TICKETS,
        label: 'Tickets',
        icon: 'bi:ticket-perforated',
        permission: 'ticket_supports:view',
      },
    ],
  },
];
