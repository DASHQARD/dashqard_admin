import { useMemo } from 'react';
import { requestManagementQueries } from '../requestManagement ';

export function usePendingRequestsCount() {
  const { useGetRequestCorporates } = requestManagementQueries();
  const { data: allRequestsResponse } = useGetRequestCorporates();
  const pendingCounts = useMemo(() => {
    const allRequestsList = allRequestsResponse?.data || []

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
  }, [allRequestsResponse]);

  return pendingCounts;
}
