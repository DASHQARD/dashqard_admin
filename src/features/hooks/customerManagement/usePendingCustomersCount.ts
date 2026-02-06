import { useMemo } from 'react';
import { useCustomers } from './useCustomers';

export function usePendingCustomersCount(): number {
  const { data } = useCustomers({ status: 'pending', limit: 100 });

  return useMemo(() => {
    const list = data?.data ?? [];
    const total = (data?.pagination as any)?.total ?? (data?.pagination as any)?.totalCount;
    if (typeof total === 'number' && total >= 0) {
      return total;
    }
    return Array.isArray(list) ? list.length : 0;
  }, [data]);
}
