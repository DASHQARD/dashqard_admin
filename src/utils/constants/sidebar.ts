import { ROUTES } from './shared';

export const ADMIN_NAV_ITEMS = [
  {
    section: 'Overview',
    items: [
      {
        path: ROUTES.IN_APP.ADMIN.HOME,
        label: 'Dashboard',
        icon: 'bi:speedometer2',
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
      },
      {
        path: ROUTES.IN_APP.ADMIN.VENDORS,
        label: 'Vendors',
        icon: 'bi:shop',
      },
      {
        path: ROUTES.IN_APP.ADMIN.CORPORATES,
        label: 'Cooperate',
        icon: 'bi:building',
      },
    ],
  },
  {
    section: 'Requests',
    items: [
      {
        path: ROUTES.IN_APP.ADMIN.REQUESTS.VENDOR_REQUESTS,
        label: 'Vendor Requests',
        icon: 'bi:shop',
      },
      {
        path: ROUTES.IN_APP.ADMIN.REQUESTS.CORPORATE_REQUESTS,
        label: 'Cooperate Requests',
        icon: 'bi:building',
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
      },
      {
        path: ROUTES.IN_APP.ADMIN.ROLES,
        label: 'Roles & Permissions',
        icon: 'bi:shield-lock-fill',
      },
      {
        path: ROUTES.IN_APP.ADMIN.ARCHIVED,
        label: 'Archived',
        icon: 'bi:archive-fill',
      },
    ],
  },
  {
    section: 'Transactions',
    items: [
      {
        path: ROUTES.IN_APP.ADMIN.TRANSACTIONS,
        label: 'All Transactions',
        icon: 'bi:receipt',
      },
      {
        path: ROUTES.IN_APP.ADMIN.PENDING_LIMITS,
        label: 'Pending Limits',
        icon: 'bi:clock-history',
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
      },
      {
        path: ROUTES.IN_APP.ADMIN.SETTINGS,
        label: 'Settings',
        icon: 'bi:gear-fill',
      },
    ],
  },
];
