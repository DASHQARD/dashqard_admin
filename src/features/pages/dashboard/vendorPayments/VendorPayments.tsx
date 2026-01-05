import React from 'react';
import { PaginatedTable, Text } from '@/components';
import { useReducerSpread } from '@/hooks';
import { Icon } from '@/libs';
import { DEFAULT_QUERY } from '@/utils/constants';
import { formatCurrency } from '@/utils';
import {
  vendorPaymentListColumns,
  vendorPaymentListCsvHeaders,
  ViewVendorPayment,
  ProcessVendorPayment,
} from '@/features/components/vendorPayments';

// Dummy data for vendor payments
const dummyVendorPayments = [
  {
    id: '1',
    vendor_name: 'Tech Solutions Ltd',
    business_name: 'Tech Solutions',
    amount: 15000.0,
    payment_period: 'January 2024',
    status: 'pending',
    due_date: '2024-02-05T00:00:00Z',
    paid_date: null,
    vendor_id: 'VEN001',
    invoice_number: 'INV-2024-001',
    description: 'Monthly service payment for January 2024',
  },
  {
    id: '2',
    vendor_name: 'Global Supplies Inc',
    business_name: 'Global Supplies',
    amount: 25000.5,
    payment_period: 'January 2024',
    status: 'paid',
    due_date: '2024-02-05T00:00:00Z',
    paid_date: '2024-02-03T10:30:00Z',
    vendor_id: 'VEN002',
    invoice_number: 'INV-2024-002',
    description: 'Monthly service payment for January 2024',
  },
  {
    id: '3',
    vendor_name: 'Digital Marketing Pro',
    business_name: 'Digital Marketing Pro',
    amount: 8500.75,
    payment_period: 'February 2024',
    status: 'pending',
    due_date: '2024-03-05T00:00:00Z',
    paid_date: null,
    vendor_id: 'VEN003',
    invoice_number: 'INV-2024-003',
    description: 'Monthly service payment for February 2024',
  },
  {
    id: '4',
    vendor_name: 'Logistics Express',
    business_name: 'Logistics Express',
    amount: 32000.0,
    payment_period: 'January 2024',
    status: 'paid',
    due_date: '2024-02-05T00:00:00Z',
    paid_date: '2024-02-01T14:20:00Z',
    vendor_id: 'VEN004',
    invoice_number: 'INV-2024-004',
    description: 'Monthly service payment for January 2024',
  },
  {
    id: '5',
    vendor_name: 'Creative Design Studio',
    business_name: 'Creative Design Studio',
    amount: 12000.25,
    payment_period: 'February 2024',
    status: 'overdue',
    due_date: '2024-03-05T00:00:00Z',
    paid_date: null,
    vendor_id: 'VEN005',
    invoice_number: 'INV-2024-005',
    description: 'Monthly service payment for February 2024',
  },
  {
    id: '6',
    vendor_name: 'Cloud Services Co',
    business_name: 'Cloud Services Co',
    amount: 45000.0,
    payment_period: 'January 2024',
    status: 'paid',
    due_date: '2024-02-05T00:00:00Z',
    paid_date: '2024-02-04T09:15:00Z',
    vendor_id: 'VEN006',
    invoice_number: 'INV-2024-006',
    description: 'Monthly service payment for January 2024',
  },
  {
    id: '7',
    vendor_name: 'Security Systems Ltd',
    business_name: 'Security Systems',
    amount: 18000.5,
    payment_period: 'February 2024',
    status: 'pending',
    due_date: '2024-03-05T00:00:00Z',
    paid_date: null,
    vendor_id: 'VEN007',
    invoice_number: 'INV-2024-007',
    description: 'Monthly service payment for February 2024',
  },
  {
    id: '8',
    vendor_name: 'Food & Beverage Corp',
    business_name: 'Food & Beverage Corp',
    amount: 28000.75,
    payment_period: 'January 2024',
    status: 'paid',
    due_date: '2024-02-05T00:00:00Z',
    paid_date: '2024-02-02T16:45:00Z',
    vendor_id: 'VEN008',
    invoice_number: 'INV-2024-008',
    description: 'Monthly service payment for January 2024',
  },
  {
    id: '9',
    vendor_name: 'Healthcare Solutions',
    business_name: 'Healthcare Solutions',
    amount: 35000.0,
    payment_period: 'February 2024',
    status: 'pending',
    due_date: '2024-03-05T00:00:00Z',
    paid_date: null,
    vendor_id: 'VEN009',
    invoice_number: 'INV-2024-009',
    description: 'Monthly service payment for February 2024',
  },
  {
    id: '10',
    vendor_name: 'Education Services Inc',
    business_name: 'Education Services',
    amount: 22000.0,
    payment_period: 'January 2024',
    status: 'paid',
    due_date: '2024-02-05T00:00:00Z',
    paid_date: '2024-02-05T11:00:00Z',
    vendor_id: 'VEN010',
    invoice_number: 'INV-2024-010',
    description: 'Monthly service payment for January 2024',
  },
];

export default function VendorPayments() {
  const [query, setQuery] = useReducerSpread(DEFAULT_QUERY);

  // Filter data based on search query
  const filteredPayments = React.useMemo(() => {
    if (!query.search) return dummyVendorPayments;
    const searchLower = query.search.toLowerCase();
    return dummyVendorPayments.filter(
      (payment) =>
        payment.vendor_name?.toLowerCase().includes(searchLower) ||
        payment.business_name?.toLowerCase().includes(searchLower) ||
        payment.invoice_number?.toLowerCase().includes(searchLower) ||
        payment.vendor_id?.toLowerCase().includes(searchLower)
    );
  }, [query.search]);

  // Filter by status if provided
  const statusFilteredPayments = React.useMemo(() => {
    if (!query.status) return filteredPayments;
    return filteredPayments.filter(
      (payment) => payment.status === query.status
    );
  }, [filteredPayments, query.status]);

  // Calculate totals for summary
  const summary = React.useMemo(() => {
    const totalPending = statusFilteredPayments
      .filter((p) => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);
    const totalPaid = statusFilteredPayments
      .filter((p) => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);
    const totalOverdue = statusFilteredPayments
      .filter((p) => p.status === 'overdue')
      .reduce((sum, p) => sum + p.amount, 0);
    const grandTotal = statusFilteredPayments.reduce(
      (sum, p) => sum + p.amount,
      0
    );

    return {
      totalPending,
      totalPaid,
      totalOverdue,
      grandTotal,
      pendingCount: statusFilteredPayments.filter((p) => p.status === 'pending')
        .length,
      paidCount: statusFilteredPayments.filter((p) => p.status === 'paid')
        .length,
      overdueCount: statusFilteredPayments.filter((p) => p.status === 'overdue')
        .length,
    };
  }, [statusFilteredPayments]);

  return (
    <>
      <div className="lg:py-10">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <Text variant="h2" weight="semibold" className="text-primary-900">
              Vendor Payments
            </Text>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Pending</p>
                  <p className="text-2xl font-semibold text-orange-600">
                    {summary.pendingCount}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatCurrency(summary.totalPending, 'GHS')}
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
                    {summary.paidCount}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatCurrency(summary.totalPaid, 'GHS')}
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
                    {summary.overdueCount}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatCurrency(summary.totalOverdue, 'GHS')}
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
                    {statusFilteredPayments.length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatCurrency(summary.grandTotal, 'GHS')}
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

          <div className="relative space-y-[37px]">
            <div className="text-[#0c4b77] py-2 border-b-2 border-[#0c4b77] w-fit">
              <Text variant="h6" weight="medium">
                Payment Records
              </Text>
            </div>
            <PaginatedTable
              filterWrapperClassName="lg:absolute lg:top-0 lg:right-[2px]"
              columns={vendorPaymentListColumns}
              data={statusFilteredPayments}
              total={statusFilteredPayments.length}
              loading={false}
              query={query}
              setQuery={setQuery}
              searchPlaceholder="Search by vendor name, business name, invoice number, or vendor ID..."
              csvHeaders={vendorPaymentListCsvHeaders}
              filterBy={{
                simpleSelects: [
                  {
                    label: 'status',
                    options: [
                      { label: 'Pending', value: 'pending' },
                      { label: 'Paid', value: 'paid' },
                      { label: 'Overdue', value: 'overdue' },
                    ],
                  },
                  {
                    label: 'payment_period',
                    options: [
                      { label: 'January 2024', value: 'January 2024' },
                      { label: 'February 2024', value: 'February 2024' },
                      { label: 'March 2024', value: 'March 2024' },
                    ],
                  },
                ],
              }}
              printTitle="Vendor Payments"
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <ViewVendorPayment />
      <ProcessVendorPayment />
    </>
  );
}
