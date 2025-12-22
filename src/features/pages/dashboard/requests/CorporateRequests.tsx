import { PaginatedTable, Text } from '@/components';

import { OPTIONS } from '@/utils/constants/filter';

import {
  ApproveRequestStatus,
  RejectRequestStatus,
  requestCorporateListColumns,
  requestCorporateListCsvHeaders,
  ViewRequestDetails,
} from '@/features/components';
import { useRequestManagementBase } from '@/features/hooks/requestManagement ';
import { MODALS } from '@/utils';
import { usePersistedModalState } from '@/hooks';

type RequestCorporate = {
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

export default function Corporates() {
  const modal = usePersistedModalState<RequestCorporate>({
    paramName: MODALS.REQUEST_CORPORATE_MANAGEMENT.PARAM_NAME,
  });
  const {
    requestCorporatesList,
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
              Corporate Requests
            </Text>
          </div>
          <div className="relative space-y-[37px]">
            <div className="text-[#0c4b77] py-2 border-b-2 border-[#0c4b77] w-fit">
              <Text variant="h6" weight="medium">
                Corporate Requests
              </Text>
            </div>
            <PaginatedTable
              filterWrapperClassName="lg:absolute lg:top-0 lg:right-[2px]"
              columns={requestCorporateListColumns}
              data={requestCorporatesList || []}
              total={requestCorporatesList?.length || 0}
              loading={isLoadingRequestCorporatesList}
              query={query}
              setQuery={setQuery}
              searchPlaceholder="Search by corporate name or location..."
              csvHeaders={requestCorporateListCsvHeaders}
              onRowClick={(row) => {
                modal.openModal(
                  MODALS.REQUEST_CORPORATE_MANAGEMENT.CHILDREN.VIEW,
                  row
                );
              }}
              filterBy={{
                simpleSelects: [
                  {
                    label: 'status',
                    options: OPTIONS.CORPORATE_MANAGEMENT_STATUS,
                  },
                ],
              }}
              printTitle="Corporates"
            />
          </div>
        </div>
      </div>

      {modal.modalState ===
        MODALS.REQUEST_CORPORATE_MANAGEMENT.CHILDREN.VIEW && (
        <ViewRequestDetails />
      )}
      {modal.modalState ===
        MODALS.REQUEST_CORPORATE_MANAGEMENT.CHILDREN.APPROVE && (
        <ApproveRequestStatus />
      )}
      {modal.modalState ===
        MODALS.REQUEST_CORPORATE_MANAGEMENT.CHILDREN.REJECT && (
        <RejectRequestStatus />
      )}
    </>
  );
}
