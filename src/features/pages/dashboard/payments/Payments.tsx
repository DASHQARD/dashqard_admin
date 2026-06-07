import { PaginatedTable, Text } from '@/components';

import {
  paymentListColumns,
  paymentListCsvHeaders,
  ViewPayment,
  UpdatePaymentStatus,
  DeletePayment,
} from '@/features/components/payments';
import { usePaymentsManagementBase } from '@/features/hooks/paymentsManagement';
import { OPTIONS, DATE_RANGE_FILTER } from '@/utils/constants';

export default function Payments() {
  const {
    paymentsList,
    isLoadingPayments,
    query,
    setQuery,
    pagination,
    handleNextPage,
    handleSetAfter,
  } = usePaymentsManagementBase();

  return (
    <>
      <div className="lg:py-10">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <Text variant="h2" weight="semibold" className="text-primary-900">
              Payments Management
            </Text>
          </div>
          <div className="relative space-y-[37px]">
            <div className="text-[#0c4b77] py-2 border-b-2 border-[#0c4b77] w-fit">
              <Text variant="h6" weight="medium">
                All Payments
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
              searchPlaceholder="Search by reference, receipt number, amount, or status..."
              csvHeaders={paymentListCsvHeaders}
              filterBy={{
                simpleSelects: [
                  {
                    label: 'status',
                    options: OPTIONS.PAYMENT_STATUS,
                  },
                ],
                date: DATE_RANGE_FILTER,
              }}
              printTitle="Payments"
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
              noSearch
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
