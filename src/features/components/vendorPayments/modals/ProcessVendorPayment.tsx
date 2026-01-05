import React from 'react';
import { Button, Modal, Text, Input, Combobox } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { MODALS } from '@/utils/constants';
import { formatCurrency } from '@/utils';
import { formatDate } from '@/utils/helpers';
import { useToast } from '@/hooks/useToast';
import { Icon } from '@/libs';

type VendorPaymentData = {
  id: string;
  vendor_name?: string;
  business_name?: string;
  amount?: number;
  payment_period?: string;
  status?: string;
  due_date?: string;
  paid_date?: string | null;
  vendor_id?: string;
  invoice_number?: string;
  description?: string;
};

type PaymentFormData = {
  paymentMethod: string;
  accountNumber: string;
  bankName: string;
  mobileMoneyNumber: string;
  mobileMoneyProvider: string;
  transactionReference: string;
  paymentDate: string;
  notes: string;
};

export function ProcessVendorPayment() {
  const modal = usePersistedModalState<VendorPaymentData>({
    paramName: MODALS.VENDOR_PAYMENT_MANAGEMENT.PARAM_NAME,
  });
  const toast = useToast();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState('bank');
  const [formData, setFormData] = React.useState<PaymentFormData>({
    paymentMethod: 'bank',
    accountNumber: '',
    bankName: '',
    mobileMoneyNumber: '',
    mobileMoneyProvider: 'mtn',
    transactionReference: '',
    paymentDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const paymentData = modal.modalData;

  const handleInputChange = (field: keyof PaymentFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProcessPayment = async () => {
    if (!paymentData) return;

    // Validation
    if (paymentMethod === 'bank' && (!formData.accountNumber || !formData.bankName)) {
      toast.error('Please provide account number and bank name');
      return;
    }

    if (paymentMethod === 'mobile_money' && !formData.mobileMoneyNumber) {
      toast.error('Please provide mobile money number');
      return;
    }

    if (!formData.transactionReference) {
      toast.error('Please provide a transaction reference');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast.success('Payment processed successfully!');
      modal.closeModal();
      
      // Reset form
      setFormData({
        paymentMethod: 'bank',
        accountNumber: '',
        bankName: '',
        mobileMoneyNumber: '',
        mobileMoneyProvider: 'mtn',
        transactionReference: '',
        paymentDate: new Date().toISOString().split('T')[0],
        notes: '',
      });
      
      // In a real app, you would refresh the data here
      // queryClient.invalidateQueries(['vendor-payments']);
    } catch (error) {
      toast.error('Failed to process payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!paymentData) {
    return null;
  }

  return (
    <Modal
      panelClass="!w-[700px] min-w-full max-h-[90vh]"
      title="Process Vendor Payout"
      isOpen={modal.isModalOpen(MODALS.VENDOR_PAYMENT_MANAGEMENT.CHILDREN.PROCESS)}
      setIsOpen={(isOpen) => {
        if (!isOpen) {
          modal.closeModal();
        }
      }}
      position="center"
      showClose={true}
    >
      <div className="px-6 py-4 max-h-[80vh] overflow-y-auto">
        <div className="space-y-6">
          {/* Payment Summary Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-100">
            <div className="flex items-center gap-2 mb-4">
              <Icon icon="bi:info-circle" className="text-blue-600 text-xl" />
              <Text variant="h6" weight="semibold" className="text-blue-900">
                Payment Summary
              </Text>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Vendor</p>
                <Text variant="span" weight="semibold" className="text-gray-800">
                  {paymentData.vendor_name || paymentData.business_name || '-'}
                </Text>
                <p className="text-xs text-gray-500 mt-1">
                  ID: {paymentData.vendor_id || '-'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Invoice Number</p>
                <Text variant="span" weight="semibold" className="text-gray-800">
                  {paymentData.invoice_number || '-'}
                </Text>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Payment Period</p>
                <Text variant="span" weight="normal" className="text-gray-800">
                  {paymentData.payment_period || '-'}
                </Text>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Due Date</p>
                <Text variant="span" weight="normal" className="text-gray-800">
                  {paymentData.due_date ? formatDate(paymentData.due_date) : '-'}
                </Text>
              </div>
              <div className="col-span-2 pt-2 border-t border-blue-200">
                <p className="text-xs text-gray-600 mb-1">Amount to Pay</p>
                <Text variant="h4" weight="bold" className="text-blue-700">
                  {paymentData.amount ? formatCurrency(paymentData.amount, 'GHS') : '-'}
                </Text>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <Combobox
              label="Payment Method"
              placeholder="Select payment method"
              value={paymentMethod}
              onChange={(e: { target: { value: string } }) => {
                const value = e.target.value;
                setPaymentMethod(value);
                handleInputChange('paymentMethod', value);
              }}
              options={[
                { label: 'Bank Transfer', value: 'bank' },
                { label: 'Mobile Money', value: 'mobile_money' },
                { label: 'Cash', value: 'cash' },
                { label: 'Cheque', value: 'cheque' },
              ]}
            />
          </div>

          {/* Bank Transfer Fields */}
          {paymentMethod === 'bank' && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <Input
                  label="Bank Name"
                  value={formData.bankName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('bankName', e.target.value)
                  }
                  placeholder="Enter bank name"
                />
              </div>
              <div>
                <Input
                  label="Account Number"
                  value={formData.accountNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('accountNumber', e.target.value)
                  }
                  placeholder="Enter account number"
                />
              </div>
            </div>
          )}

          {/* Mobile Money Fields */}
          {paymentMethod === 'mobile_money' && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <Combobox
                  label="Mobile Money Provider"
                  placeholder="Select provider"
                  value={formData.mobileMoneyProvider}
                  onChange={(e: { target: { value: string } }) =>
                    handleInputChange('mobileMoneyProvider', e.target.value)
                  }
                  options={[
                    { label: 'MTN Mobile Money', value: 'mtn' },
                    { label: 'Vodafone Cash', value: 'vodafone' },
                    { label: 'AirtelTigo Money', value: 'airteltigo' },
                  ]}
                />
              </div>
              <div>
                <Input
                  label="Mobile Money Number"
                  value={formData.mobileMoneyNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('mobileMoneyNumber', e.target.value)
                  }
                  placeholder="Enter mobile money number"
                />
              </div>
            </div>
          )}

          {/* Transaction Details */}
          <div className="space-y-4">
            <div>
              <Input
                label="Transaction Reference"
                value={formData.transactionReference}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange('transactionReference', e.target.value)
                }
                placeholder="Enter transaction reference/ID"
              />
              <p className="text-xs text-gray-500 mt-1">
                This is the reference number from your payment system
              </p>
            </div>

            <div>
              <Input
                label="Payment Date"
                type="date"
                value={formData.paymentDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange('paymentDate', e.target.value)
                }
              />
            </div>

            <div>
              <Input
                label="Notes (Optional)"
                type="textarea"
                value={formData.notes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  handleInputChange('notes', e.target.value)
                }
                placeholder="Add any additional notes about this payment"
                rows={3}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => modal.closeModal()}
              disabled={isProcessing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleProcessPayment}
              disabled={isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Icon icon="bi:arrow-repeat" className="animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Icon icon="bi:check-circle" className="mr-2" />
                  Process Payout
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

