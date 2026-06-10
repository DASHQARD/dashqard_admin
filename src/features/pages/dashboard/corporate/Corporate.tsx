import { PaginatedTable, Text } from '@/components';

import { OPTIONS } from '@/utils/constants/filter';

import {
  ActivateCorporate,
  corporateListColumns,
  corporateListCsvHeaders,
  SuspendCorporate,
  ViewKycDocument,
} from '@/features/components/corporate';
import { useCorporateManagementBase } from '@/features/hooks/corporateManagement';

export default function Corporates() {
  const {
    corporatesList,
    isLoadingCorporatesList,
    query,
    setQuery,
    pagination,
    handleNextPage,
    handleSetAfter,
  } = useCorporateManagementBase();

  return (
    <>
      <div className="lg:py-10">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <Text variant="h2" weight="semibold" className="text-primary-900">
              Corporate management
            </Text>
          </div>
          <div className="relative space-y-[37px]">
            <div className="text-[#0c4b77] py-2 border-b-2 border-[#0c4b77] w-fit">
              <Text variant="h6" weight="medium">
                Corporate management
              </Text>
            </div>
            <PaginatedTable
              filterWrapperClassName="lg:absolute lg:top-0 lg:right-[2px]"
              columns={corporateListColumns}
              data={corporatesList || []}
              total={corporatesList?.length || 0}
              loading={isLoadingCorporatesList}
              query={query}
              setQuery={setQuery}
              searchPlaceholder="Search by corporate name or location..."
              csvHeaders={corporateListCsvHeaders}
              filterBy={{
                simpleSelects: [
                  {
                    label: 'status',
                    filterLabel: 'status',
                    options: OPTIONS.CORPORATE_MANAGEMENT_STATUS,
                  },
                ],
              }}
              printTitle="Corporates"
              hasNextPage={pagination?.hasNextPage}
              hasPreviousPage={pagination?.hasPreviousPage}
              currentAfter={
                (query as any).after ? String((query as any).after) : undefined
              }
              previousCursor={pagination?.previous || null}
              onNextPage={handleNextPage}
              onPreviousPage={() => {
                // Handle previous page
                const queryWithAfter = query as any;
                if (queryWithAfter.after && pagination?.previous) {
                  handleSetAfter(pagination.previous);
                } else {
                  // Reset to first page
                  handleSetAfter('');
                }
              }}
              onSetAfter={handleSetAfter}
            />
          </div>
        </div>
      </div>

      <ActivateCorporate />
      <SuspendCorporate />
      <ViewKycDocument />
    </>
  );
}
