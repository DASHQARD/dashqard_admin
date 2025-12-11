import { Outlet } from 'react-router-dom';
import { useAutoRefreshAdminToken } from '@/hooks/useAutoRefreshAdminToken';
import { Sidebar } from '../components';

export default function AdminLayout() {
  useAutoRefreshAdminToken();

  return (
    <div className="no-print relative flex">
      <Sidebar />
      <div className="bg-gray-50 flex h-screen w-full flex-col overflow-y-auto">
        <main className="flex-1 px-5 sm:px-10 py-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
