import { Button, PaginatedTable, Text } from '@/components';
import { Icon } from '@/libs';
import { formatCurrency, OPTIONS } from '@/utils';
import { usePersistedModalState } from '@/hooks';
import { MODALS } from '@/utils/constants';
import {
  vendorPaymentListColumns,
  vendorPaymentListCsvHeaders,
  ViewVendorPayment,
  ProcessVendorPayment,
  CreateVendorPayment,
  UpdateVendorPaymentPreferences,
  UpdateVendorPayment,
  DeleteVendorPayment,
} from '@/features/components/vendorPayments';
import { vendorPaymentsManagementQueries } from '@/features/hooks/vendorPaymentsManagement';
import React from 'react';
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

  const modal = usePersistedModalState({
    paramName: MODALS.VENDOR_PAYMENT_MANAGEMENT.PARAM_NAME,
  });

  const { useGetVendorPaymentBranches } = vendorPaymentsManagementQueries();
  const { data: branchesResponse, isLoading: isLoadingBranches } =
    useGetVendorPaymentBranches({ limit: 10 });

  const branchesList = React.useMemo(() => {
    if (!branchesResponse) return [];
    const raw = branchesResponse as { data?: unknown[] };
    const arr = raw?.data ?? branchesResponse;
    return Array.isArray(arr) ? arr : [];
  }, [branchesResponse]);

  return (
    <>
      <div className="lg:py-10">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Text variant="h2" weight="semibold" className="text-primary-900">
              Vendor Payments
            </Text>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                modal.openModal(
                  MODALS.VENDOR_PAYMENT_MANAGEMENT.CHILDREN.ADD_RECORD
                )
              }
            >
              <Icon icon="bi:plus-lg" className="mr-2" />
              Create payment
            </Button>
          </div>

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

          <div className="space-y-4">
            <div className="text-[#0c4b77] py-2 border-b-2 border-[#0c4b77] w-fit">
              <Text variant="h6" weight="medium">
                Payment branches overview
              </Text>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
              {isLoadingBranches ? (
                <p className="p-6 text-sm text-gray-500">Loading branches…</p>
              ) : branchesList.length === 0 ? (
                <p className="p-6 text-sm text-gray-500">
                  No branch payment data returned.
                </p>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 font-medium text-gray-700">
                        Branch
                      </th>
                      <th className="px-4 py-3 font-medium text-gray-700">
                        Location
                      </th>
                      <th className="px-4 py-3 font-medium text-gray-700">
                        Pending
                      </th>
                      <th className="px-4 py-3 font-medium text-gray-700">
                        Paid
                      </th>
                      <th className="px-4 py-3 font-medium text-gray-700">
                        Overdue
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {branchesList.map(
                      (row: Record<string, unknown>, i: number) => (
                        <tr
                          key={
                            (row.id as string) ?? (row.branch_id as string) ?? i
                          }
                          className="border-b border-gray-100 last:border-0"
                        >
                          <td className="px-4 py-3">
                            {(row.branch_name as string) ??
                              (row.name as string) ??
                              '—'}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {(row.branch_location as string) ??
                              (row.location as string) ??
                              '—'}
                          </td>
                          <td className="px-4 py-3">
                            {String(
                              row.pending_count ??
                                (row.summary as Record<string, unknown>)
                                  ?.pending_count ??
                                '—'
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {String(
                              row.paid_count ??
                                (row.summary as Record<string, unknown>)
                                  ?.paid_count ??
                                '—'
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {String(
                              row.overdue_count ??
                                (row.summary as Record<string, unknown>)
                                  ?.overdue_count ??
                                '—'
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              )}
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
                currentAfter={
                  (query as any).after
                    ? String((query as any).after)
                    : undefined
                }
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
      <CreateVendorPayment />
      <UpdateVendorPayment />
      <DeleteVendorPayment />
      <UpdateVendorPaymentPreferences />
    </>
  );
}
