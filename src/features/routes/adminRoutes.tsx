import { type RouteObject } from 'react-router-dom';
import {
  Admins,
  CorporateDetails,
  Corporates,
  Customers,
  Home,
  Vendors,
  Permissions,
  Onboarding,
  TransactionLimits,
  Countries,
  Fees,
  Profile,
  Tickets,
  Payment,
  Payments,
  SuperAdminInvitations,
} from '../pages';
import VendorDetails from '../pages/dashboard/vendors/VendorDetails';
import { CorporateRequests, VendorRequests } from '../pages/dashboard/requests';
import InviteAdmin from '../pages/dashboard/admins/InviteAdmin';

export const adminRoutes: RouteObject[] = [
  {
    index: true,
    element: <Home />,
  },
  {
    path: 'onboard',
    element: <Onboarding />,
  },
  {
    path: 'customers',
    element: <Customers />,
  },
  {
    path: 'vendors',
    element: <Vendors />,
  },
  {
    path: 'vendors/:vendorId',
    element: <VendorDetails />,
  },
  {
    path: 'corporates',
    element: <Corporates />,
  },
  {
    path: 'admins',
    element: <Admins />,
  },
  {
    path: 'admins/invite',
    element: <InviteAdmin />,
  },
  {
    path: 'requests',
    children: [
      {
        path: 'corporate-requests',
        element: <CorporateRequests />,
      },
      {
        path: 'vendor-requests',
        element: <VendorRequests />,
      },
    ],
  },
  {
    path: 'corporates/:corporateId',
    element: <CorporateDetails />,
  },
  {
    path: 'roles',
    element: <Permissions />,
  },
  {
    path: 'transaction-limits',
    element: <TransactionLimits />,
  },
  {
    path: 'countries',
    element: <Countries />,
  },
  {
    path: 'fees',
    element: <Fees />,
  },
  {
    path: 'profile',
    element: <Profile />,
  },
  {
    path: 'tickets',
    element: <Tickets />,
  },
  {
    path: 'payment',
    element: <Payment />,
  },
  {
    path: 'payments',
    element: <Payments />,
  },
  {
    path: 'super-admin-invitations',
    element: <SuperAdminInvitations />,
  },
];
