import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NuqsAdapter } from 'nuqs/adapters/react-router';

import { ToastProvider } from '../ToastProvider';
import { useAutoRefreshToken } from '@/hooks';

const queryClient = new QueryClient();

function AuthSessionWatcher({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  useAutoRefreshToken();
  return children;
}

export function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ToastProvider>
      <AuthSessionWatcher>
        <NuqsAdapter>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </NuqsAdapter>
      </AuthSessionWatcher>
    </ToastProvider>
  );
}
