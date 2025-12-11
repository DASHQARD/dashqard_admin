import { type RouteObject } from 'react-router-dom';
import { CustomErrorBoundary } from '@/components';
import { DashboardLayout } from '@/features';
import { authRoutes, dashboardRoutes } from '@/features/routes';

export const routes: RouteObject[] = [
  {
    path: '/',
    errorElement: <CustomErrorBoundary />,
    children: authRoutes,
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    errorElement: <CustomErrorBoundary />,
    children: dashboardRoutes,
  },
];
