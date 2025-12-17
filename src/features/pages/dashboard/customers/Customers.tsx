import { PaginatedTable, Text } from '@/components';

import { OPTIONS } from '@/utils/constants';
import { useCustomersManagementBase } from '@/features/hooks';
import { customerListColumns } from '@/features/components';
import { CustomerDetailsModal } from './CustomerDetailsModal';
import { UpdateCustomerStatusModal } from './UpdateCustomerStatusModal';

export default function Customers() {
  const { customers, isLoadingCustomers, query, setQuery } =
    useCustomersManagementBase();

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
                { label: 'status', options: OPTIONS.TRANSACTION_STATUS },
                {
                  label: 'direction',
                  options: OPTIONS.TRANSACTION_TYPE,
                },
              ],
            }}
            noSearch
          />
        </div>
      </section>

      {/* Modals */}
      <CustomerDetailsModal />

      <UpdateCustomerStatusModal />
    </div>
  );
}
