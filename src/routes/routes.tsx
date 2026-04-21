import { Navigate, type RouteObject } from 'react-router-dom';
import { CustomErrorBoundary } from '@/components';
import {
  AdminLayout,
  DashboardLayout,
  RootLayout,
  RouteGuard,
} from '@/features';
import { adminRoutes, authRoutes, dashboardRoutes } from '@/features/routes';
import { AdminOnboarding } from '@/features/pages';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <CustomErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to="/auth/login" replace />,
      },
      // Must be before "admin" so /admin/onboard matches here, not admin's child routes
      {
        path: 'admin/onboard',
        element: <AdminOnboarding />,
      },
      {
        path: 'admin/onboard/',
        element: <AdminOnboarding />,
      },
      {
        path: 'auth',
        errorElement: <CustomErrorBoundary />,
        children: authRoutes,
      },
      {
        path: 'dashboard',
        element: (
          <RouteGuard>
            <DashboardLayout />
          </RouteGuard>
        ),
        errorElement: <CustomErrorBoundary />,
        children: dashboardRoutes,
      },
      {
        path: 'admin',
        element: (
          <RouteGuard>
            <AdminLayout />
          </RouteGuard>
        ),
        errorElement: <CustomErrorBoundary />,
        children: adminRoutes,
      },
    ],
  },
];
