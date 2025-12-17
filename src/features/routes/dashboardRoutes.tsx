import { type RouteObject } from 'react-router-dom';
import { Customers, Home } from '../pages';
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
  // {
  //   path: ROUTES.IN_APP.ADMIN.VENDORS,
  //   element: <Vendors />,
  // },
  // {
  //   path: ROUTES.IN_APP.ADMIN.MERCHANTS,
  //   element: <Merchants />,
  // },
];
