import { Navigate, type RouteObject } from 'react-router-dom';
import { CustomErrorBoundary } from '@/components';
import { AdminLayout, DashboardLayout } from '@/features';
import { adminRoutes, authRoutes, dashboardRoutes } from '@/features/routes';
import { AdminOnboarding } from '@/features/pages';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/auth/login" replace />,
  },
  {
    path: '/auth',
    errorElement: <CustomErrorBoundary />,
    children: authRoutes,
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    errorElement: <CustomErrorBoundary />,
    children: dashboardRoutes,
  },
  {
    path: '/admin/onboard',
    element: <AdminOnboarding />,
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    errorElement: <CustomErrorBoundary />,
    children: adminRoutes,
  },
];
