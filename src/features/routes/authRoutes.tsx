import { type RouteObject } from 'react-router-dom';
import { Login, Onboarding } from '../pages';

export const authRoutes: RouteObject[] = [
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: 'onboard',
    element: <Onboarding />,
  },
];
