import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { Button, CustomIcon, Tag, Text } from '@/components';
import BranchPaymentModal from './BranchPaymentModal';

type BranchStatus = 'active' | 'inactive';

type Branch = {
  id: string;
  vendorId: string;
  branchName: string;
  branchCode: string;
  location: string;
  vendorName: string;
  status: BranchStatus;
};

const mockBranches: Branch[] = [
  {
    id: 'branch-001',
    vendorId: '1',
    branchName: 'Accra Main Branch',
    branchCode: 'AC-001',
    location: 'East Legon, Accra',
    vendorName: 'Dash Logistics',
    status: 'active',
  },
  {
    id: 'branch-002',
    vendorId: '1',
    branchName: 'Kumasi Central Branch',
    branchCode: 'KS-002',
    location: 'Adum, Kumasi',
    vendorName: 'Dash Logistics',
    status: 'active',
  },
  {
    id: 'branch-003',
    vendorId: '1',
    branchName: 'Takoradi Port Branch',
    branchCode: 'TK-003',
    location: 'Market Circle, Takoradi',
    vendorName: 'Dash Logistics',
    status: 'inactive',
  },
];

export default function VendorBranches() {
  const navigate = useNavigate();
  const params = useParams();
  const vendorId = params?.vendorId ?? '';
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentBranchName, setPaymentBranchName] = useState('');

  const branches = useMemo(
    () =>
      mockBranches.filter(
        (branch) => branch.vendorId === vendorId || vendorId === ''
      ),
    [vendorId]
  );

  const branchVariant = (status: BranchStatus) =>
    status === 'active' ? ('success' as const) : ('warning' as const);

  return (
    <div className="md:py-10 space-y-8">
      <div>
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
        <h2 className="text-2xl font-semibold text-primary-900 mt-2">
          Vendor Branches
        </h2>
      </div>

      <div className="border border-gray-200 rounded-lg">
        <div className="flex justify-between items-center bg-[#FAFAFA] p-3">
          <h2 className="text-gray-500 font-medium">Mock Branches List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="border-b border-gray-100">
              <tr>
                <th className="text-left p-3 text-xs text-gray-400 font-medium">
                  Branch Name
                </th>
                <th className="text-left p-3 text-xs text-gray-400 font-medium">
                  Branch Code
                </th>
                <th className="text-left p-3 text-xs text-gray-400 font-medium">
                  Location
                </th>
                <th className="text-left p-3 text-xs text-gray-400 font-medium">
                  Vendor
                </th>
                <th className="text-left p-3 text-xs text-gray-400 font-medium">
                  Status
                </th>
                <th className="text-left p-3 text-xs text-gray-400 font-medium">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {branches.map((branch) => (
                <tr
                  key={branch.id}
                  className="border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50"
                  onClick={() =>
                    navigate(
                      vendorId
                        ? `/admin/vendors/${vendorId}/branches/${branch.id}`
                        : `/admin/vendors/branches/${branch.id}`
                    )
                  }
                >
                  <td className="p-3 text-sm text-primary-900">
                    {branch.branchName}
                  </td>
                  <td className="p-3 text-sm text-primary-900">
                    {branch.branchCode}
                  </td>
                  <td className="p-3 text-sm text-primary-900">
                    {branch.location}
                  </td>
                  <td className="p-3 text-sm text-primary-900">
                    {branch.vendorName}
                  </td>
                  <td className="p-3 text-sm">
                    <Tag
                      value={branch.status === 'active' ? 'Active' : 'Inactive'}
                      variant={branchVariant(branch.status)}
                    />
                  </td>
                  <td className="p-3 text-sm">
                    <Button
                      size="small"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPaymentBranchName(branch.branchName);
                        setIsPaymentModalOpen(true);
                      }}
                    >
                      Make payment to branch
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {branches.length === 0 && (
            <div className="p-4">
              <Text className="text-sm text-gray-500">
                No mock branches available for this vendor.
              </Text>
            </div>
          )}
        </div>
      </div>
      <BranchPaymentModal
        isOpen={isPaymentModalOpen}
        setIsOpen={setIsPaymentModalOpen}
        branchName={paymentBranchName}
      />
    </div>
  );
}
