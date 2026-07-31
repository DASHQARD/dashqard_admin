import { type RouteObject } from 'react-router-dom';
import {
  AdminOnboarding,
  ForgotPassword,
  Login,
  ResetPassword,
} from '../pages';

export const authRoutes: RouteObject[] = [
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: 'onboard',
    element: <AdminOnboarding />,
  },
  {
    path: 'forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: 'reset-password',
    element: <ResetPassword />,
  },
];
