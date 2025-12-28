import { useMemo } from 'react';
import { requestManagementQueries } from '../requestManagement ';

export function usePendingRequestsCount() {
  const { useGetRequestCorporates } = requestManagementQueries();
  const { data: allRequestsList } = useGetRequestCorporates();

  const pendingCounts = useMemo(() => {
    if (!allRequestsList || !Array.isArray(allRequestsList)) {
      return { corporate: 0, vendor: 0 };
    }

    const corporatePending = allRequestsList.filter(
      (request: any) =>
        request.user_type?.toLowerCase().includes('corporate') &&
        request.status?.toLowerCase() === 'pending'
    ).length;

    const vendorPending = allRequestsList.filter(
      (request: any) =>
        request.user_type?.toLowerCase() === 'vendor' &&
        request.status?.toLowerCase() === 'pending'
    ).length;

    return {
      corporate: corporatePending,
      vendor: vendorPending,
    };
  }, [allRequestsList]);

  return pendingCounts;
}
