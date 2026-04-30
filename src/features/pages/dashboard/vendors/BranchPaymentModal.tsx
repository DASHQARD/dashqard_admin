import { useEffect, useState } from 'react';

import { Button, Input, Modal, Text } from '@/components';

export type NewBranchPayment = {
  id: string;
  reference: string;
  date: string;
  method: string;
  amount: number;
  status: 'processing';
};

type Props = Readonly<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  branchName: string;
  onSubmit?: (payment: NewBranchPayment) => void;
}>;

export default function BranchPaymentModal({
  isOpen,
  setIsOpen,
  branchName,
  onSubmit,
}: Props) {
  const [reference, setReference] = useState('');
  const [method, setMethod] = useState('Bank Transfer');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setReference('');
      setMethod('Bank Transfer');
      setAmount('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsedAmount = Number(amount);
    if (!reference.trim() || !method.trim() || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      return;
    }

    onSubmit?.({
      id: `PMT-BR-${Date.now()}`,
      reference: reference.trim(),
      date: new Date().toISOString(),
      method: method.trim(),
      amount: parsedAmount,
      status: 'processing',
    });
    setIsOpen(false);
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} showClose panelClass="max-w-[520px]">
      <div className="p-6">
        <Text className="text-lg font-semibold text-primary-900">
          Make Payment To Branch
        </Text>
        <Text className="text-sm text-gray-500 mt-1">
          Record a mock payment for {branchName}.
        </Text>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Reference"
            value={reference}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setReference(e.target.value)
            }
            placeholder="e.g. ACC-MAY-001"
          />
          <Input
            label="Payment Method"
            value={method}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setMethod(e.target.value)
            }
            placeholder="e.g. Bank Transfer"
          />
          <Input
            label="Amount (GHS)"
            type="number"
            min={1}
            value={amount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAmount(e.target.value)
            }
            placeholder="e.g. 1500"
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="secondary">
              Save Payment
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
