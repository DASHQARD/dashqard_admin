import { type RouteObject } from 'react-router-dom';
import { Home } from '../pages';
import { ROUTES } from '@/utils/constants';

export const dashboardRoutes: RouteObject[] = [
  {
    path: ROUTES.IN_APP.DASHBOARD.HOME,
    element: <Home />,
  },
];
