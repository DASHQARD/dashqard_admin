import { useMemo } from 'react';
import {
  isCorporateRequest,
  isPendingRequestStatus,
  isVendorRequest,
} from '@/features/utils/requestFilters';
import { requestManagementQueries } from '../requestManagement ';

/** Pending vendor + branch requests from GET /requests/admin (not vendor-management). */
export function usePendingRequestsCount() {
  const { useGetRequestCorporates } = requestManagementQueries();
  const { data: allRequestsResponse } = useGetRequestCorporates({ limit: 100 });

  const pendingCounts = useMemo(() => {
    const allRequestsList = allRequestsResponse?.data ?? [];

    const corporatePending = allRequestsList.filter(
      (request: { user_type?: string; status?: string }) =>
        isCorporateRequest(request) && isPendingRequestStatus(request.status)
    ).length;

    const vendorPending = allRequestsList.filter(
      (request: { user_type?: string; status?: string }) =>
        isVendorRequest(request) && isPendingRequestStatus(request.status)
    ).length;

    return {
      corporate: corporatePending,
      vendor: vendorPending,
    };
  }, [allRequestsResponse]);

  return pendingCounts;
}
