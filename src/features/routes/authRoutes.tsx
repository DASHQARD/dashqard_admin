import { type RouteObject } from 'react-router-dom';
import { Login } from '../pages';

export const authRoutes: RouteObject[] = [
  {
    path: 'login',
    element: <Login />,
  },
];
