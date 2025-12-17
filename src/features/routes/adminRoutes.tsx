import { type RouteObject } from 'react-router-dom';
import { Customers, Home } from '../pages';

export const adminRoutes: RouteObject[] = [
  {
    index: true,
    element: <Home />,
  },
  {
    path: 'customers',
    element: <Customers />,
  },
  // Add other admin routes here as needed
];
