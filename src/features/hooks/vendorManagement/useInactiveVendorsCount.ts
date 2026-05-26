import { useMemo } from 'react';
import { vendorManagementQueries } from './vendorQueries';

export function useInactiveVendorsCount(): number {
  const { useGetVendors } = vendorManagementQueries();
  const { data } = useGetVendors({ limit: 100 });

  return useMemo(() => {
    const list = data?.data ?? [];
    const total = data?.pagination?.total ?? data?.pagination?.totalCount;
    if (typeof total === 'number' && total >= 0) {
      return total;
    }
    return Array.isArray(list) ? list.length : 0;
  }, [data]);
}
