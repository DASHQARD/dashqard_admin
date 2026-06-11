import { Modal, Tag, Text } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { vendorPaymentsManagementQueries } from '@/features/hooks/vendorPaymentsManagement';
import { MODALS } from '@/utils/constants';
import { formatDate, getStatusVariant, formatCurrency } from '@/utils/helpers';
import type { VendorPaymentData } from '@/types';
import { Icon } from '@/libs';
import { useCallback } from 'react';

export function ViewVendorPayment() {
  const modal = usePersistedModalState<VendorPaymentData>({
    paramName: MODALS.VENDOR_PAYMENT_MANAGEMENT.PARAM_NAME,
  });

  const paymentId =
    modal.modalData?.id != null ? String(modal.modalData.id) : '';
  const isOpen = modal.isModalOpen(
    MODALS.VENDOR_PAYMENT_MANAGEMENT.CHILDREN.VIEW
  );
  const { useGetVendorPaymentById } = vendorPaymentsManagementQueries();
  const { data: fetchedPayment, isLoading } = useGetVendorPaymentById(
    paymentId,
    {
      enabled: isOpen && Boolean(paymentId),
    }
  );

  const payment = (fetchedPayment ??
    modal.modalData) as VendorPaymentData | null;

  const handleSetIsOpen = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        modal.closeModal();
      }
    },
    [modal]
  );

  const paymentInfo = [
    {
      label: 'Invoice Number',
      value: payment?.invoice_number || '-',
      icon: 'bi:receipt',
    },
    {
      label: 'Payment ID',
      value: payment?.id || '-',
      icon: 'bi:hash',
    },
    {
      label: 'Transaction Reference',
      value: payment?.transaction_reference || '-',
      icon: 'bi:arrow-left-right',
    },
  ];

  const vendorInfo = [
    {
      label: 'Vendor Name',
      value: payment?.vendor_name || '-',
      icon: 'bi:person-circle',
    },
    {
      label: 'Vendor ID',
      value: payment?.vendor_id || '-',
      icon: 'bi:id-card',
    },
    {
      label: 'Vendor GVID',
      value: payment?.vendor_gvid || '-',
      icon: 'bi:building',
    },
    {
      label: 'Branch Location',
      value: payment?.branch_location || '-',
      icon: 'bi:geo-alt',
    },
  ];

  const paymentDetails = [
    {
      label: 'Payment Amount',
      value: payment?.payment_amount
        ? formatCurrency(
            typeof payment?.payment_amount === 'string'
              ? parseFloat(payment?.payment_amount)
              : payment?.payment_amount,
            'GHS'
          )
        : '-',
      icon: 'bi:cash-stack',
      highlight: true,
    },
    {
      label: 'Payment Method',
      value: payment?.payment_method
        ? payment.payment_method.charAt(0).toUpperCase() +
          payment.payment_method.slice(1).replace('_', ' ')
        : '-',
      icon: 'bi:credit-card',
    },
    {
      label: 'Payment Frequency',
      value: payment?.payment_frequency || '-',
      icon: 'bi:clock-history',
    },
    {
      label: 'Payment Period',
      value: payment?.payment_period || '-',
      icon: 'bi:calendar-range',
    },
  ];

  const timelineInfo = [
    {
      label: 'Due Date',
      value: payment?.due_date ? formatDate(payment?.due_date) : '-',
      icon: 'bi:calendar-check',
    },
    {
      label: 'Paid Date',
      value: payment?.paid_date ? formatDate(payment?.paid_date) : '-',
      icon: 'bi:calendar-event',
    },
    {
      label: 'Created Date',
      value: payment?.created_at ? formatDate(payment?.created_at) : '-',
      icon: 'bi:calendar-plus',
    },
    {
      label: 'Last Updated',
      value: payment?.updated_at ? formatDate(payment?.updated_at) : '-',
      icon: 'bi:calendar2-date',
    },
  ];

  const additionalInfo = [
    {
      label: 'Description',
      value: payment?.description || '-',
      icon: 'bi:text-paragraph',
      fullWidth: true,
    },
    {
      label: 'Notes',
      value: payment?.notes || '-',
      icon: 'bi:sticky',
      fullWidth: true,
    },
  ];

  if (!paymentId) return null;

  if (isLoading) {
    return (
      <Modal
        panelClass="!w-[750px] min-w-full max-h-[90vh]"
        title="Vendor Payment Details"
        isOpen={isOpen}
        setIsOpen={handleSetIsOpen}
        position="side"
        showClose={true}
      >
        <div className="h-full px-6 flex items-center justify-center py-12">
          <Text variant="span">Loading payment details...</Text>
        </div>
      </Modal>
    );
  }

  if (!payment) return null;

  const renderInfoSection = (title: string, items: any[], columns = 2) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon icon="bi:chevron-right" className="text-blue-600 text-lg" />
        <Text variant="h6" weight="semibold" className="text-gray-800">
          {title}
        </Text>
      </div>
      <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-4`}>
        {items.map((item, index) => (
          <div
            key={index}
            className={`p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow ${
              item.fullWidth ? 'md:col-span-2' : ''
            } ${item.highlight ? 'border-l-4 border-l-blue-500' : ''}`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Icon icon={item.icon} className="text-blue-600 text-lg" />
              </div>
              <div className="flex-1 min-w-0">
                <Text
                  weight="medium"
                  className="text-gray-500 uppercase tracking-wide mb-1"
                >
                  {item.label}
                </Text>
                <Text
                  weight="medium"
                  className={`text-gray-900 truncate ${
                    item.highlight ? 'text-lg font-semibold text-blue-700' : ''
                  }`}
                >
                  {item.value}
                </Text>
                {item.subtext && (
                  <Text variant="span" className="text-gray-400 mt-1">
                    {item.subtext}
                  </Text>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Modal
      panelClass="!w-[750px] min-w-full max-h-[90vh]"
      title="Vendor Payment Details"
      isOpen={modal.isModalOpen(MODALS.VENDOR_PAYMENT_MANAGEMENT.CHILDREN.VIEW)}
      setIsOpen={handleSetIsOpen}
      position="side"
      showClose={true}
    >
      <div className="h-full px-6 flex flex-col gap-6">
        {/* Header with Status */}
        <div className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Text variant="h4" weight="bold" className="text-gray-900">
                Payment Details
              </Text>
              <Text variant="span" className="text-gray-500 mt-1">
                Invoice: {payment.invoice_number || 'N/A'}
              </Text>
            </div>
            <Tag
              value={
                payment.status
                  ? payment.status.charAt(0).toUpperCase() +
                    payment.status.slice(1)
                  : 'Pending'
              }
              variant={getStatusVariant(payment?.status || 'pending')}
              className="px-4 py-1.5 text-sm"
            />
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 mb-6"></div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-6 space-y-8">
          {/* Payment Summary Card */}
          <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text
                  variant="span"
                  weight="medium"
                  className="text-blue-800 mb-1"
                >
                  Total Payment Amount
                </Text>
                <Text variant="h3" weight="bold" className="text-blue-900">
                  {payment?.payment_amount
                    ? formatCurrency(
                        typeof payment?.payment_amount === 'string'
                          ? parseFloat(payment?.payment_amount)
                          : payment?.payment_amount,
                        'GHS'
                      )
                    : '-'}
                </Text>
              </div>
              <div className="p-3 bg-white rounded-lg border border-blue-300">
                <Icon icon="bi:wallet2" className="text-blue-600 text-2xl" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <Text variant="span" className="text-blue-700 mb-1">
                  Vendor
                </Text>
                <Text variant="span" weight="medium" className="text-gray-800">
                  {payment.vendor_name}
                </Text>
              </div>
              <div>
                <Text variant="span" className="text-blue-700 mb-1">
                  Payment Method
                </Text>
                <Text variant="span" weight="medium" className="text-gray-800">
                  {payment.vendor_preferred_payment_method
                    ? payment.vendor_preferred_payment_method
                        .charAt(0)
                        .toUpperCase() +
                      payment.vendor_preferred_payment_method
                        .slice(1)
                        .replace('_', ' ')
                    : '-'}
                </Text>
              </div>
            </div>
          </div>

          {/* Organized Sections */}
          {renderInfoSection('Payment Information', paymentInfo)}
          {renderInfoSection('Vendor Information', vendorInfo)}
          {renderInfoSection('Payment Details', paymentDetails)}
          {renderInfoSection('Timeline', timelineInfo)}
          {renderInfoSection('Additional Information', additionalInfo, 1)}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <Text variant="span" className="text-gray-400">
              Last updated:{' '}
              {payment.updated_at ? formatDate(payment.updated_at) : 'N/A'}
            </Text>
          </div>
        </div>
      </div>
    </Modal>
  );
}
