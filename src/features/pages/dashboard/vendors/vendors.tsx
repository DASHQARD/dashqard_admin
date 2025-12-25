import { PaginatedTable, Text } from '@/components';

import { OPTIONS } from '@/utils/constants/filter';
import {
  vendorListColumns,
  vendorListCsvHeaders,
  ViewVendorDetails,
  ApproveVendor,
  ActivateVendor,
  DeactivateVendor,
} from '@/features/components/vendors';
import { useVendorManagementBase } from '@/features/hooks/vendorManagement';

export default function Vendors() {
  const { query, setQuery, vendorsList, isLoadingVendorsList } =
    useVendorManagementBase();

  return (
    <>
      <div className="lg:py-10">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <Text variant="h2" weight="semibold" className="text-primary-900">
              Vendors management
            </Text>
          </div>
          <div className="relative space-y-[37px]">
            <div className="text-[#0c4b77] py-2 border-b-2 border-[#0c4b77] w-fit">
              <Text variant="h6" weight="medium">
                Vendors management
              </Text>
            </div>
            <PaginatedTable
              filterWrapperClassName="lg:absolute lg:top-0 lg:right-[2px]"
              columns={vendorListColumns}
              data={vendorsList || []}
              total={vendorsList?.length || 0}
              loading={isLoadingVendorsList}
              query={query}
              setQuery={setQuery}
              searchPlaceholder="Search by vendor name or location..."
              csvHeaders={vendorListCsvHeaders}
              filterBy={{
                simpleSelects: [
                  {
                    label: 'status',
                    options: OPTIONS.VENDOR_MANAGEMENT_STATUS,
                  },
                ],
              }}
              printTitle="Vendors"
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <ViewVendorDetails />
      <ApproveVendor />
      <ActivateVendor />
      <DeactivateVendor />
    </>
  );
}
