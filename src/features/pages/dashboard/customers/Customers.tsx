import { PaginatedTable, Text } from '@/components';
import { useSearchParams } from 'react-router-dom';

import { OPTIONS } from '@/utils/constants';
import { useCustomersManagementBase } from '@/features/hooks';
import { customerListColumns } from '@/features/components';
import { UpdateCustomerStatusModal } from './UpdateCustomerStatusModal';
import { ViewCustomerDetailsModal } from './ViewCustomerDetailsModal';
import type { Customer } from '@/types/customer';

export default function Customers() {
  const [searchParams, setSearchParams] = useSearchParams();
  const customerIdForStatus = searchParams.get('manage-status');

  const {
    customers,
    isLoadingCustomers,
    query,
    setQuery,
    pagination,
    handleNextPage,
    handleSetAfter,
  } = useCustomersManagementBase();

  // Get the specific customer for the status modal
  const selectedCustomerForStatus =
    customers?.find((c: Customer) => String(c.id) === customerIdForStatus) ||
    null;

  const handleCloseStatusModal = () => {
    searchParams.delete('manage-status');
    setSearchParams(searchParams);
  };

  return (
    <div className="">
      <section className="py-8 flex flex-col gap-6">
        <Text variant="h2">Customers Management</Text>

        <div className="relative space-y-[37px]">
          <div className="text-[#0c4b77] py-2 border-b-2 border-[#0c4b77] w-fit">
            <Text variant="h6" weight="medium">
              All customers
            </Text>
          </div>
          <PaginatedTable
            filterWrapperClassName="lg:absolute lg:top-0 lg:right-[2px]"
            columns={customerListColumns}
            data={customers || []}
            query={query}
            setQuery={setQuery}
            loading={isLoadingCustomers}
            csvHeaders={[]}
            filterBy={{
              simpleSelects: [
                {
                  label: 'status',
                  options: OPTIONS.CUSTOMER_MANAGEMENT_STATUS,
                },
              ],
              date: [{ queryKey: 'dateFrom' }, { queryKey: 'dateTo' }],
            }}
            noSearch
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
      </section>

      {/* Modals */}
      <UpdateCustomerStatusModal
        customer={selectedCustomerForStatus}
        isOpen={!!customerIdForStatus}
        onClose={handleCloseStatusModal}
      />
      <ViewCustomerDetailsModal />
    </div>
  );
}
