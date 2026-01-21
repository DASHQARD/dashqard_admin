import { PaginatedTable, Text } from '@/components';
import { Icon } from '@/libs';
import { formatCurrency, OPTIONS } from '@/utils';
import {
  vendorPaymentListColumns,
  vendorPaymentListCsvHeaders,
  ViewVendorPayment,
  ProcessVendorPayment,
} from '@/features/components/vendorPayments';
import {
  UpdateVendorPaymentPreferences,
  UpdateVendorPayment,
  DeleteVendorPayment,
} from '@/features/components/vendorPayments/modals';
import { useVendorPaymentsManagementBase } from '@/features/hooks/vendorPaymentsManagement';

export default function VendorPayments() {
  const {
    query,
    setQuery,
    vendorPaymentList,
    isLoadingVendorPayments,
    summaryData,
    paginationInfo,
    handleNextPage,
    handlePreviousPage,
    handleSetAfter,
    // getVendorPaymentOptions,
  } = useVendorPaymentsManagementBase();

  return (
    <>
      <div className="lg:py-10">
        <div className="flex flex-col gap-8">
          <Text variant="h2" weight="semibold" className="text-primary-900">
            Vendor Payments
          </Text>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Pending</p>
                  <p className="text-2xl font-semibold text-orange-600">
                    {summaryData?.pending_count}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatCurrency(summaryData?.total_pending, 'GHS')}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Icon
                    icon="bi:clock-history"
                    className="text-orange-600 text-xl"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Paid</p>
                  <p className="text-2xl font-semibold text-green-600">
                    {summaryData?.paid_count}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatCurrency(summaryData?.total_paid, 'GHS')}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Icon
                    icon="bi:check-circle"
                    className="text-green-600 text-xl"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Overdue</p>
                  <p className="text-2xl font-semibold text-red-600">
                    {summaryData?.overdue_count}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatCurrency(summaryData?.total_overdue, 'GHS')}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Icon
                    icon="bi:exclamation-triangle"
                    className="text-red-600 text-xl"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Grand Total</p>
                  <p className="text-2xl font-semibold text-blue-600">
                    {summaryData?.pending_count +
                      summaryData?.paid_count +
                      summaryData?.overdue_count}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatCurrency(summaryData?.grand_total, 'GHS')}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Icon
                    icon="bi:currency-dollar"
                    className="text-blue-600 text-xl"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-[37px]">
            <div className="text-[#0c4b77] py-2 border-b-2 border-[#0c4b77] w-fit">
              <Text variant="h6" weight="medium">
                Payment Records
              </Text>
            </div>
            <div className="relative lg:pt-16">
              <PaginatedTable
                filterWrapperClassName="lg:absolute lg:top-0 lg:right-[2px]"
                columns={vendorPaymentListColumns}
                data={vendorPaymentList || []}
                total={vendorPaymentList?.length}
                loading={isLoadingVendorPayments}
                query={query}
                setQuery={setQuery}
                searchPlaceholder="Search by invoice number, vendor name, or GVID..."
                csvHeaders={vendorPaymentListCsvHeaders}
                filterBy={{
                  simpleSelects: [
                    {
                      label: 'status',
                      options: OPTIONS.VENDOR_PAYMENT_STATUS,
                    },
                    {
                      label: 'payment_frequency',
                      options: OPTIONS.VENDOR_PAYMENT_FREQUENCY,
                    },
                  ],
                }}
                printTitle="Vendor Payments"
                hasNextPage={paginationInfo.hasNextPage}
                hasPreviousPage={paginationInfo.hasPreviousPage}
                currentAfter={(query as any).after ? String((query as any).after) : undefined}
                previousCursor={paginationInfo.previous || null}
                onNextPage={handleNextPage}
                onPreviousPage={handlePreviousPage}
                onSetAfter={handleSetAfter}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ViewVendorPayment />
      <ProcessVendorPayment />
      <UpdateVendorPayment />
      <DeleteVendorPayment />
      <UpdateVendorPaymentPreferences />
    </>
  );
}
