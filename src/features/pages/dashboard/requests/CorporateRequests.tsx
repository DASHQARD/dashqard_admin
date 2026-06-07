import { PaginatedTable, Text } from '@/components';

import { OPTIONS, DATE_RANGE_FILTER } from '@/utils/constants/filter';

import {
  ApproveRequestStatus,
  DeleteRequest,
  RejectRequestStatus,
  requestCorporateListColumns,
  requestCorporateListCsvHeaders,
  ViewRequestDetails,
} from '@/features/components';
import { useRequestManagementBase } from '@/features/hooks/requestManagement ';
import { MODALS } from '@/utils';
import { usePersistedModalState } from '@/hooks';
// import { useNavigate } from 'react-router';
import type { RequestCorporate } from '@/types';

export default function Corporates() {
  // const navigate = useNavigate();
  const modal = usePersistedModalState<RequestCorporate>({
    paramName: MODALS.REQUEST_CORPORATE_MANAGEMENT.PARAM_NAME,
  });
  const {
    requestCorporatesList,
    isLoadingRequestCorporatesList,
    query,
    setQuery,
    pagination,
    handleNextPage,
    handleSetAfter,
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
              // onRowClick={(row) => {
              //   navigate(
              //     ROUTES.IN_APP.DASHBOARD.CORPORATE_DETAILS.replace(
              //       ':corporateId',
              //       row.entity_id
              //     )
              //   );
              // }}
              filterBy={{
                simpleSelects: [
                  {
                    label: 'status',
                    options: OPTIONS.REQUEST_STATUS,
                  },
                ],
                date: DATE_RANGE_FILTER,
              }}
              printTitle="Corporate Requests"
              hasNextPage={pagination?.hasNextPage}
              hasPreviousPage={pagination?.hasPreviousPage}
              currentAfter={
                (query as { after?: string }).after
                  ? String((query as { after?: string }).after)
                  : undefined
              }
              previousCursor={pagination?.previous ?? null}
              onNextPage={handleNextPage}
              onPreviousPage={() => {
                const queryWithAfter = query as { after?: string };
                if (queryWithAfter.after && pagination?.previous) {
                  handleSetAfter(pagination.previous);
                } else {
                  handleSetAfter('');
                }
              }}
              onSetAfter={handleSetAfter}
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
      {modal.modalState ===
        MODALS.REQUEST_CORPORATE_MANAGEMENT.CHILDREN.DELETE && (
        <DeleteRequest />
      )}
    </>
  );
}
