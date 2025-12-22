import { PaginatedTable, Text } from '@/components';

import { OPTIONS } from '@/utils/constants/filter';

import {
  corporateListColumns,
  corporateListCsvHeaders,
} from '@/features/components/corporate';
import { useCorporateManagementBase } from '@/features/hooks/corporateManagement';

export default function Corporates() {
  const {
    corporatesList,
    corporateInfo,
    isLoadingCorporatesList,
    query,
    setQuery,
  } = useCorporateManagementBase();

  console.log('corporatesList', corporatesList);
  console.log('corporateInfo', corporateInfo);
  console.log('isLoadingCorporatesList', isLoadingCorporatesList);

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
              loading={false}
              query={query}
              setQuery={setQuery}
              searchPlaceholder="Search by corporate name or location..."
              csvHeaders={corporateListCsvHeaders}
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
    </>
  );
}
