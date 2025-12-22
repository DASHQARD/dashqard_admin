import { PaginatedTable, Text } from '@/components';

import { OPTIONS } from '@/utils/constants/filter';

import { useAdminManagementBase } from '@/features/hooks/adminManagement';
import { adminListColumns, adminListCsvHeaders } from '@/features/components';

export default function Admins() {
  const { adminsList, isLoadingAdminsList, query, setQuery } =
    useAdminManagementBase();

  console.log('adminsList', adminsList);

  console.log('isLoadingAdminsList', isLoadingAdminsList);

  return (
    <>
      <div className="lg:py-10">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <Text variant="h2" weight="semibold" className="text-primary-900">
              Admin management
            </Text>
          </div>
          <div className="relative space-y-[37px]">
            <div className="text-[#0c4b77] py-2 border-b-2 border-[#0c4b77] w-fit">
              <Text variant="h6" weight="medium">
                Admin management
              </Text>
            </div>
            <PaginatedTable
              filterWrapperClassName="lg:absolute lg:top-0 lg:right-[2px]"
              columns={adminListColumns}
              data={adminsList || []}
              total={adminsList?.length || 0}
              loading={false}
              query={query}
              setQuery={setQuery}
              searchPlaceholder="Search by corporate name or location..."
              csvHeaders={adminListCsvHeaders}
              filterBy={{
                simpleSelects: [
                  {
                    label: 'status',
                    options: OPTIONS.CORPORATE_MANAGEMENT_STATUS,
                  },
                ],
              }}
              printTitle="Admins"
            />
          </div>
        </div>
      </div>
    </>
  );
}
