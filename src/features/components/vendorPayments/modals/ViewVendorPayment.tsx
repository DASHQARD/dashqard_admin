import { Modal, Tag, Text } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { MODALS } from '@/utils/constants';
import { formatDate, getStatusVariant } from '@/utils/helpers';
import { formatCurrency } from '@/utils';
import { Icon } from '@/libs';

type VendorPaymentData = {
  id: string;
  vendor_name?: string;
  payment_frequency?: string;
  branch_location?: string;
  amount?: number;
  payment_period?: string;
  status?: string;
  due_date?: string;
  paid_date?: string | null;
  vendor_id?: string;
  invoice_number?: string;
  description?: string;
  // Vendor payment method details
  payment_method?: 'mobile_money' | 'bank';
  mobile_money_provider?: string;
  mobile_money_number?: string;
  bank_name?: string;
  bank_branch?: string;
  account_name?: string;
  account_number?: string;
  swift_code?: string;
  sort_code?: string;
};

export function ViewVendorPayment() {
  const modal = usePersistedModalState<VendorPaymentData>({
    paramName: MODALS.VENDOR_PAYMENT_MANAGEMENT.PARAM_NAME,
  });

  const paymentData = modal.modalData;
  const isOpen = modal.isModalOpen(
    MODALS.VENDOR_PAYMENT_MANAGEMENT.CHILDREN.VIEW
  );

  // Example payment data to display
  const examplePaymentData: VendorPaymentData = {
    id: 'PAY-2024-001',
    vendor_id: 'VEN001',
    vendor_name: 'Tech Solutions Ltd',
    invoice_number: 'INV-2024-001',
    payment_frequency: 'Monthly',
    branch_location: 'Accra, Ghana',
    amount: 15000.0,
    payment_period: 'January 2024',
    status: 'pending',
    due_date: '2024-02-05T00:00:00Z',
    paid_date: null,
    description: 'Monthly service payment for January 2024',
    payment_method: 'mobile_money',
    mobile_money_provider: 'MTN Mobile Money',
    mobile_money_number: '+233 24 123 4567',
  };

  // Use example data if no payment data is available
  const displayData = paymentData || examplePaymentData;

  return (
    <Modal
      panelClass="!w-[680px] min-w-full"
      title="Vendor Payment Details"
      isOpen={isOpen}
      setIsOpen={(isOpen) => {
        if (!isOpen) {
          modal.closeModal();
        }
      }}
      position="side"
      showClose={true}
    >
      <div className="h-full px-6 flex flex-col gap-6 justify-between">
        <div className="grow overflow-y-auto py-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">Status</p>
              <Tag
                value={displayData.status || 'Pending'}
                variant={getStatusVariant(displayData.status || 'pending')}
                className="w-fit"
              />
            </div>

            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">Invoice Number</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {displayData.invoice_number || '-'}
              </Text>
            </div>

            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">Vendor ID</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {displayData.vendor_id || '-'}
              </Text>
            </div>

            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">Vendor Name</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {displayData.vendor_name || '-'}
              </Text>
            </div>

            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">Payment Frequency</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {displayData.payment_frequency || '-'}
              </Text>
            </div>

            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">Branch Location</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {displayData.branch_location || '-'}
              </Text>
            </div>

            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">Payment Amount</p>
              <Text
                variant="span"
                weight="semibold"
                className="text-gray-800 text-lg"
              >
                {displayData.amount
                  ? formatCurrency(displayData.amount, 'GHS')
                  : '-'}
              </Text>
            </div>

            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">Payment Period</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {displayData.payment_period || '-'}
              </Text>
            </div>

            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">Due Date</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {displayData.due_date ? formatDate(displayData.due_date) : '-'}
              </Text>
            </div>

            {displayData.paid_date && (
              <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
                <p className="text-gray-400 text-xs">Paid Date</p>
                <Text variant="span" weight="normal" className="text-gray-800">
                  {formatDate(displayData.paid_date)}
                </Text>
              </div>
            )}

            {displayData.description && (
              <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
                <p className="text-gray-400 text-xs">Description</p>
                <Text variant="span" weight="normal" className="text-gray-800">
                  {displayData.description}
                </Text>
              </div>
            )}

            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">Payment ID</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {displayData.id || '-'}
              </Text>
            </div>
          </div>

          {/* Vendor Payment Method Details */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Icon icon="bi:wallet2" className="text-primary-600" />
              <Text variant="h6" weight="semibold" className="text-gray-900">
                Vendor Payment Method
              </Text>
            </div>
            <div className="space-y-4">
              {/* Mobile Money Example */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Icon icon="bi:phone" className="text-primary-600" />
                  <Text
                    variant="span"
                    weight="semibold"
                    className="text-gray-900"
                  >
                    Mobile Money
                  </Text>
                </div>
                <div className="space-y-2">
                  <div className="flex flex-col gap-1">
                    <p className="text-gray-400 text-xs">Provider</p>
                    <Text
                      variant="span"
                      weight="normal"
                      className="text-gray-800"
                    >
                      {displayData.mobile_money_provider || 'MTN Mobile Money'}
                    </Text>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-gray-400 text-xs">Mobile Money Number</p>
                    <Text
                      variant="span"
                      weight="normal"
                      className="text-gray-800"
                    >
                      {displayData.mobile_money_number || '+233 24 123 4567'}
                    </Text>
                  </div>
                </div>
              </div>

              {/* Bank Account Example */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Icon icon="bi:bank" className="text-primary-600" />
                  <Text
                    variant="span"
                    weight="semibold"
                    className="text-gray-900"
                  >
                    Bank Account
                  </Text>
                </div>
                <div className="space-y-2">
                  <div className="flex flex-col gap-1">
                    <p className="text-gray-400 text-xs">Bank Name</p>
                    <Text
                      variant="span"
                      weight="normal"
                      className="text-gray-800"
                    >
                      {displayData.bank_name || 'Ghana Commercial Bank'}
                    </Text>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-gray-400 text-xs">Branch</p>
                    <Text
                      variant="span"
                      weight="normal"
                      className="text-gray-800"
                    >
                      {displayData.bank_branch || 'Accra Main Branch'}
                    </Text>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-gray-400 text-xs">Account Name</p>
                    <Text
                      variant="span"
                      weight="normal"
                      className="text-gray-800"
                    >
                      {displayData.account_name || 'Tech Solutions Ltd'}
                    </Text>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-gray-400 text-xs">Account Number</p>
                    <Text
                      variant="span"
                      weight="normal"
                      className="text-gray-800"
                    >
                      {displayData.account_number || '1234567890'}
                    </Text>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-gray-400 text-xs">SWIFT Code</p>
                    <Text
                      variant="span"
                      weight="normal"
                      className="text-gray-800"
                    >
                      {displayData.swift_code || 'GCBLGHAC'}
                    </Text>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-gray-400 text-xs">Sort Code</p>
                    <Text
                      variant="span"
                      weight="normal"
                      className="text-gray-800"
                    >
                      {displayData.sort_code || '123456'}
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
