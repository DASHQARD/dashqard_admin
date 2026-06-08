import { useMemo } from 'react';
import { vendorManagementQueries } from './vendorQueries';

export function useInactiveVendorsCount(): number {
  const { useGetVendors } = vendorManagementQueries();
  const { data } = useGetVendors({ limit: 100, status: 'inactive' });

  return useMemo(() => {
    const list = data?.data ?? [];
    return Array.isArray(list) ? list.length : 0;
  }, [data]);
}
