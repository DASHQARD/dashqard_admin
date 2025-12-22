import { type RouteObject } from 'react-router-dom';
import { Customers, Home, Vendors } from '../pages';
import CorporateDetails from '../pages/dashboard/corporate/CorporateDetails';
import { ROUTES } from '@/utils/constants';

export const dashboardRoutes: RouteObject[] = [
  {
    path: ROUTES.IN_APP.DASHBOARD.HOME,
    element: <Home />,
  },
  {
    path: ROUTES.IN_APP.DASHBOARD.CUSTOMERS,
    element: <Customers />,
  },
  {
    path: ROUTES.IN_APP.DASHBOARD.VENDORS,
    element: <Vendors />,
  },
  {
    path: 'corporates/:corporateId',
    element: <CorporateDetails />,
  },
  // {
  //   path: ROUTES.IN_APP.ADMIN.MERCHANTS,
  //   element: <Merchants />,
  // },
];
