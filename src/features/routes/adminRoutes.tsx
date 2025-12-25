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
} from '../pages';
import { CorporateRequests } from '../pages/dashboard/requests';
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
      // {
      //   path: 'vendor-requests',
      //   element: <VendorRequests />,
      // },
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
];
