import { type RouteObject } from 'react-router-dom';
import { AdminOnboarding, Login } from '../pages';

export const authRoutes: RouteObject[] = [
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: 'onboard',
    element: <AdminOnboarding />,
  },
];
