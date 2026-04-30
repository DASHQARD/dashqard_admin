import { type RouteObject } from 'react-router-dom';
import {
  Admins,
  CorporateDetails,
  Corporates,
  Customers,
  Home,
  Vendors,
  Permissions,
  TransactionLimits,
  Countries,
  Fees,
  CardConfigurations,
  PaymentProviderConfig,
  Profile,
  Tickets,
  Payment,
  Payments,
  VendorPayments,
  SuperAdminInvitations,
  Users,
} from '../pages';
import VendorDetails from '../pages/dashboard/vendors/VendorDetails';
import VendorBranches from '../pages/dashboard/vendors/VendorBranches';
import VendorBranchDetails from '../pages/dashboard/vendors/VendorBranchDetails';
import { CorporateRequests, VendorRequests } from '../pages/dashboard/requests';
import InviteAdmin from '../pages/dashboard/admins/InviteAdmin';

export const adminRoutes: RouteObject[] = [
  {
    index: true,
    element: <Home />,
  },
  {
    path: 'customers',
    element: <Customers />,
  },
  {
    path: 'users',
    element: <Users />,
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
    path: 'vendors/:vendorId/branches',
    element: <VendorBranches />,
  },
  {
    path: 'vendors/:vendorId/branches/:branchId',
    element: <VendorBranchDetails />,
  },
  {
    path: 'vendors/branches',
    element: <VendorBranches />,
  },
  {
    path: 'vendors/branches/:branchId',
    element: <VendorBranchDetails />,
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
    path: 'card-configurations',
    element: <CardConfigurations />,
  },
  {
    path: 'payment-provider-config',
    element: <PaymentProviderConfig />,
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
    path: 'vendor-payments',
    element: <VendorPayments />,
  },
  {
    path: 'super-admin-invitations',
    element: <SuperAdminInvitations />,
  },
];
