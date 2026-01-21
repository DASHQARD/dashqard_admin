import { PaginatedTable, Text } from '@/components';

import { OPTIONS } from '@/utils/constants/filter';

import {
  ApproveVendorRequestStatus,
  DeleteVendorRequest,
  RejectVendorRequestStatus,
  requestVendorListColumns,
  requestVendorListCsvHeaders,
  ViewVendorRequestDetails,
} from '@/features/components';
import { useRequestManagementBase } from '@/features/hooks/requestManagement ';
import { MODALS } from '@/utils';
import { usePersistedModalState } from '@/hooks';

type RequestVendor = {
  id: number;
  request_id: string;
  name: string;
  type: string;
  description: string;
  status: string;
  entity_id: string;
  created_at: string;
  updated_at: string;
};

export default function VendorRequests() {
  const modal = usePersistedModalState<RequestVendor>({
    paramName: MODALS.REQUEST_VENDOR_MANAGEMENT.PARAM_NAME,
  });
  const {
    requestVendorsList,
    isLoadingRequestCorporatesList,
    query,
    setQuery,
  } = useRequestManagementBase();



  return (
    <>
      <div className="lg:py-10">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <Text variant="h2" weight="semibold" className="text-primary-900">
              Vendor Requests
            </Text>
          </div>
          <div className="relative space-y-[37px]">
            <div className="text-[#0c4b77] py-2 border-b-2 border-[#0c4b77] w-fit">
              <Text variant="h6" weight="medium">
                Vendor Requests
              </Text>
            </div>
            <PaginatedTable
              filterWrapperClassName="lg:absolute lg:top-0 lg:right-[2px]"
              columns={requestVendorListColumns}
              data={requestVendorsList || []}
              total={requestVendorsList?.length || 0}
              loading={isLoadingRequestCorporatesList}
              query={query}
              setQuery={setQuery}
              searchPlaceholder="Search by vendor name or location..."
              csvHeaders={requestVendorListCsvHeaders}
              filterBy={{
                simpleSelects: [
                  {
                    label: 'status',
                    options: OPTIONS.VENDOR_MANAGEMENT_STATUS,
                  },
                ],
                date: [{ queryKey: 'dateFrom' }, { queryKey: 'dateTo' }],
              }}
              printTitle="Vendor Requests"
              hasNextPage={false}
              hasPreviousPage={false}
              currentAfter={(query as any).after ? String((query as any).after) : undefined}
              previousCursor={null}
              onNextPage={() => {
                // Pagination will be implemented when hook supports it
              }}
              onPreviousPage={() => {
                // Pagination will be implemented when hook supports it
              }}
              onSetAfter={(after: string) => {
                // Pagination will be implemented when hook supports it
                const queryWithAfter = query as any;
                if (after) {
                  setQuery({ ...query, after } as any);
                } else {
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const { after: _, ...rest } = queryWithAfter;
                  setQuery(rest);
                }
              }}
            />
          </div>
        </div>
      </div>

      {modal.modalState === MODALS.REQUEST_VENDOR_MANAGEMENT.CHILDREN.VIEW && (
        <ViewVendorRequestDetails />
      )}
      {modal.modalState ===
        MODALS.REQUEST_VENDOR_MANAGEMENT.CHILDREN.APPROVE && (
          <ApproveVendorRequestStatus />
        )}
      {modal.modalState ===
        MODALS.REQUEST_VENDOR_MANAGEMENT.CHILDREN.REJECT && (
          <RejectVendorRequestStatus />
        )}
      {modal.modalState ===
        MODALS.REQUEST_VENDOR_MANAGEMENT.CHILDREN.DELETE && (
          <DeleteVendorRequest />
        )}
    </>
  );
}
