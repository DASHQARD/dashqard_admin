import { PaginatedTable, Text } from '@/components';

import { OPTIONS, DATE_RANGE_FILTER } from '@/utils/constants/filter';
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
  const {
    query,
    setQuery,
    vendorsList,
    isLoadingVendorsList,
    pagination,
    handleNextPage,
    handleSetAfter,
  } = useVendorManagementBase();

  return (
    <>
      <div className="lg:py-10">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <Text variant="h2" weight="semibold" className="text-primary-900">
              Vendors management
            </Text>
          </div>
          <div className="flex flex-col gap-6">
            <div className="text-[#0c4b77] py-2 border-b-2 border-[#0c4b77] w-fit">
              <Text variant="h6" weight="medium">
                Vendors management
              </Text>
            </div>
            <PaginatedTable
              columns={vendorListColumns}
              data={vendorsList || []}
              total={vendorsList?.length || 0}
              loading={isLoadingVendorsList}
              query={query}
              setQuery={setQuery}
              searchPlaceholder="Search by vendor name, email, or business..."
              csvHeaders={vendorListCsvHeaders}
              filterBy={{
                simpleSelects: [
                  {
                    label: 'vendor_status',
                    filterLabel: 'Vendor status',
                    options: OPTIONS.VENDOR_USER_STATUS,
                  },
                  {
                    label: 'approval_status',
                    filterLabel: 'Approval status',
                    options: OPTIONS.VENDOR_APPROVAL_STATUS,
                  },
                  {
                    label: 'status',
                    filterLabel: 'Account status',
                    options: OPTIONS.VENDOR_ACCOUNT_STATUS,
                  },
                  {
                    label: 'relationship_type',
                    filterLabel: 'Relationship',
                    options: OPTIONS.VENDOR_RELATIONSHIP_TYPE,
                  },
                ],
                date: DATE_RANGE_FILTER,
              }}
              printTitle="Vendors"
              hasNextPage={pagination?.hasNextPage}
              hasPreviousPage={pagination?.hasPreviousPage}
              currentAfter={query.after ? String(query.after) : undefined}
              previousCursor={pagination?.previous || null}
              onNextPage={handleNextPage}
              onPreviousPage={() => {
                if (query.after && pagination?.previous) {
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

      {/* Modals */}
      <ViewVendorDetails />
      <ApproveVendor />
      <ActivateVendor />
      <DeactivateVendor />
    </>
  );
}
