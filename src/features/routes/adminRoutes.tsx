import { type RouteObject } from 'react-router-dom';
import {
  Admins,
  CorporateDetails,
  Corporates,
  Customers,
  Home,
  Vendors,
  Permissions,
} from '../pages';
import { CorporateRequests } from '../pages/dashboard/requests';

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
