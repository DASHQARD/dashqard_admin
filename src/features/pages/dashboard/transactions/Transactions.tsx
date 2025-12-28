import { PaginatedTable, Text } from '@/components';

import {
  paymentListColumns,
  paymentListCsvHeaders,
  ViewPayment,
  UpdatePaymentStatus,
  DeletePayment,
} from '@/features/components/payments';
import { usePaymentsManagementBase } from '@/features/hooks/paymentsManagement';

export default function Transactions() {
  const { paymentsList, isLoadingPayments, query, setQuery } =
    usePaymentsManagementBase();

  return (
    <>
      <div className="lg:py-10">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <Text variant="h2" weight="semibold" className="text-primary-900">
              Payment
            </Text>
          </div>
          <div className="relative space-y-[37px]">
            <div className="text-[#0c4b77] py-2 border-b-2 border-[#0c4b77] w-fit">
              <Text variant="h6" weight="medium">
                Payment
              </Text>
            </div>
            <PaginatedTable
              filterWrapperClassName="lg:absolute lg:top-0 lg:right-[2px]"
              columns={paymentListColumns}
              data={paymentsList || []}
              total={paymentsList?.length || 0}
              loading={isLoadingPayments}
              query={query}
              setQuery={setQuery}
              searchPlaceholder="Search by transaction ID, receipt number, user name, amount, or status..."
              csvHeaders={paymentListCsvHeaders}
              filterBy={{
                simpleSelects: [
                  {
                    label: 'status',
                    options: [
                      { label: 'Pending', value: 'pending' },
                      { label: 'Paid', value: 'paid' },
                    ],
                  },
                ],
              }}
              printTitle="Payment"
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <ViewPayment />
      <UpdatePaymentStatus />
      <DeletePayment />
    </>
  );
}
