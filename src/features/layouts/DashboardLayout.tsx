import { Outlet } from 'react-router';
import { useAuthStore } from '@/stores';
import { Sidebar } from '../components';
import { useAdminService } from '../hooks/useAdminService';
import { useAutoRefreshAdminToken } from '@/hooks/useAutoRefreshAdminToken';

export default function DashboardLayout() {
  useAutoRefreshAdminToken();
  const { user } = useAuthStore();
  console.log('user', user);
  const { useGetAdminInfo } = useAdminService();
  const { data: userProfile } = useGetAdminInfo(user?.admin_id);

  console.log('userProfile', userProfile);

  return (
    <div className="no-print relative flex overflow-hidden h-screen">
      <Sidebar />
      <div className="bg-gray-50 flex h-screen w-full flex-col overflow-y-auto overflow-x-hidden">
        {/* <Topbar /> */}
        <main className="flex-1 px-5 sm:px-10 py-5 min-w-0 max-w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
