import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { Button, CustomIcon, Tag, Text } from '@/components';
import BranchPaymentModal, {
  type NewBranchPayment,
} from './BranchPaymentModal';

type BranchStatus = 'active' | 'inactive';
type PaymentStatus = 'paid' | 'processing' | 'failed';

type BranchDetails = {
  id: string;
  vendorId: string;
  vendorName: string;
  branchName: string;
  branchCode: string;
  location: string;
  status: BranchStatus;
  paymentMethods: string[];
};

type BranchPayment = {
  id: string;
  branchId: string;
  reference: string;
  date: string;
  method: string;
  amount: number;
  status: PaymentStatus;
};

const mockBranchDetails: BranchDetails[] = [
  {
    id: 'branch-001',
    vendorId: '1',
    vendorName: 'Dash Logistics',
    branchName: 'Accra Main Branch',
    branchCode: 'AC-001',
    location: 'East Legon, Accra',
    status: 'active',
    paymentMethods: ['Bank Transfer', 'Mobile Money'],
  },
  {
    id: 'branch-002',
    vendorId: '1',
    vendorName: 'Dash Logistics',
    branchName: 'Kumasi Central Branch',
    branchCode: 'KS-002',
    location: 'Adum, Kumasi',
    status: 'active',
    paymentMethods: ['Bank Transfer'],
  },
  {
    id: 'branch-003',
    vendorId: '1',
    vendorName: 'Dash Logistics',
    branchName: 'Takoradi Port Branch',
    branchCode: 'TK-003',
    location: 'Market Circle, Takoradi',
    status: 'inactive',
    paymentMethods: ['Mobile Money'],
  },
];

const mockBranchPayments: BranchPayment[] = [
  {
    id: 'PMT-BR-1001',
    branchId: 'branch-001',
    reference: 'ACC-APR-001',
    date: '2026-04-26T10:30:00Z',
    method: 'Bank Transfer',
    amount: 5400,
    status: 'paid',
  },
  {
    id: 'PMT-BR-1002',
    branchId: 'branch-001',
    reference: 'ACC-APR-002',
    date: '2026-04-19T15:00:00Z',
    method: 'Mobile Money',
    amount: 1600,
    status: 'processing',
  },
  {
    id: 'PMT-BR-2001',
    branchId: 'branch-002',
    reference: 'KMS-APR-001',
    date: '2026-04-23T09:10:00Z',
    method: 'Bank Transfer',
    amount: 3900,
    status: 'paid',
  },
  {
    id: 'PMT-BR-2002',
    branchId: 'branch-002',
    reference: 'KMS-MAR-002',
    date: '2026-03-31T14:45:00Z',
    method: 'Bank Transfer',
    amount: 2100,
    status: 'failed',
  },
  {
    id: 'PMT-BR-3001',
    branchId: 'branch-003',
    reference: 'TKD-APR-001',
    date: '2026-04-10T08:20:00Z',
    method: 'Mobile Money',
    amount: 1250,
    status: 'paid',
  },
];

export default function VendorBranchDetails() {
  const navigate = useNavigate();
  const { branchId } = useParams();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const branch = useMemo(
    () => mockBranchDetails.find((item) => item.id === branchId),
    [branchId]
  );

  const initialPayments = useMemo(
    () => mockBranchPayments.filter((payment) => payment.branchId === branchId),
    [branchId]
  );
  const [payments, setPayments] = useState<BranchPayment[]>(initialPayments);

  useEffect(() => {
    setPayments(initialPayments);
  }, [initialPayments]);

  const paymentVariant = (status: PaymentStatus) => {
    if (status === 'paid') return 'success' as const;
    if (status === 'processing') return 'warning' as const;
    return 'error' as const;
  };

  if (!branch) {
    return (
      <div className="md:py-10 space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-gray-500 text-xs cursor-pointer"
        >
          <CustomIcon
            name="ArrowTurnBackward"
            className="-rotate-x-180"
            width={20}
            height={20}
          />
          Back
        </button>
        <div className="border border-gray-200 rounded-lg p-4">
          <Text className="text-sm text-gray-500">Branch not found.</Text>
        </div>
      </div>
    );
  }

  const handleAddPayment = (payment: NewBranchPayment) => {
    setPayments((prev) => [
      {
        ...payment,
        branchId: branch.id,
      },
      ...prev,
    ]);
  };

  return (
    <div className="md:py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-gray-500 text-xs cursor-pointer"
        >
          <CustomIcon
            name="ArrowTurnBackward"
            className="-rotate-x-180"
            width={20}
            height={20}
          />
          Back to Branches
        </button>
        <h2 className="text-2xl font-semibold text-primary-900 mt-2">
          {branch.branchName}
        </h2>
        <Button variant="secondary" onClick={() => setIsPaymentModalOpen(true)}>
          Make payment to branch
        </Button>
      </div>

      <div className="border border-gray-200 rounded-lg">
        <div className="bg-[#FAFAFA] p-3">
          <h2 className="text-gray-500 font-medium">Branch Information</h2>
        </div>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 p-4">
          <div className="flex flex-col gap-1 min-w-0">
            <p className="text-xs text-gray-400">Vendor Under</p>
            <Text variant="span">{branch.vendorName}</Text>
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <p className="text-xs text-gray-400">Branch Code</p>
            <Text variant="span">{branch.branchCode}</Text>
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <p className="text-xs text-gray-400">Location</p>
            <Text variant="span">{branch.location}</Text>
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <p className="text-xs text-gray-400">Status</p>
            <Tag
              value={branch.status === 'active' ? 'Active' : 'Inactive'}
              variant={branch.status === 'active' ? 'success' : 'warning'}
            />
          </div>
        </section>
      </div>

      <div className="border border-gray-200 rounded-lg">
        <div className="bg-[#FAFAFA] p-3">
          <h2 className="text-gray-500 font-medium">Payment Methods</h2>
        </div>
        <div className="p-4 flex flex-wrap gap-2">
          {branch.paymentMethods.map((method) => (
            <Tag key={method} value={method} variant="gray" />
          ))}
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg">
        <div className="bg-[#FAFAFA] p-3">
          <h2 className="text-gray-500 font-medium">
            Payments Made To This Branch
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="border-b border-gray-100">
              <tr>
                <th className="text-left p-3 text-xs text-gray-400 font-medium">
                  Payment ID
                </th>
                <th className="text-left p-3 text-xs text-gray-400 font-medium">
                  Reference
                </th>
                <th className="text-left p-3 text-xs text-gray-400 font-medium">
                  Date
                </th>
                <th className="text-left p-3 text-xs text-gray-400 font-medium">
                  Method
                </th>
                <th className="text-left p-3 text-xs text-gray-400 font-medium">
                  Amount
                </th>
                <th className="text-left p-3 text-xs text-gray-400 font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  <td className="p-3 text-sm text-primary-900">{payment.id}</td>
                  <td className="p-3 text-sm text-primary-900">
                    {payment.reference}
                  </td>
                  <td className="p-3 text-sm text-primary-900">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-sm text-primary-900">
                    {payment.method}
                  </td>
                  <td className="p-3 text-sm text-primary-900">
                    {new Intl.NumberFormat('en-GH', {
                      style: 'currency',
                      currency: 'GHS',
                    }).format(payment.amount)}
                  </td>
                  <td className="p-3 text-sm">
                    <Tag
                      value={
                        payment.status.charAt(0).toUpperCase() +
                        payment.status.slice(1)
                      }
                      variant={paymentVariant(payment.status)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {payments.length === 0 && (
            <div className="p-4">
              <Text className="text-sm text-gray-500">
                No mock payments found for this branch.
              </Text>
            </div>
          )}
        </div>
      </div>

      <BranchPaymentModal
        isOpen={isPaymentModalOpen}
        setIsOpen={setIsPaymentModalOpen}
        branchName={branch.branchName}
        onSubmit={handleAddPayment}
      />
    </div>
  );
}
