import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { Button, CustomIcon, Tag, Text } from '@/components';
import { vendorManagementQueries } from '@/features/hooks/vendorManagement';
import { extractVendorBranchListItems } from '@/features/utils/vendorBranches';
import BranchPaymentModal from './BranchPaymentModal';

export default function VendorBranches() {
  const navigate = useNavigate();
  const params = useParams();
  const vendorId = params?.vendorId ?? '';
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentBranchName, setPaymentBranchName] = useState('');

  const { useGetVendorBranches, useGetVendorsAllDetails } =
    vendorManagementQueries();

  const { data: vendorBranchesResponse, isLoading: isLoadingVendorBranches } =
    useGetVendorBranches(
      vendorId,
      { include_related_vendors: false },
      { enabled: !!vendorId }
    );

  const { data: allVendorsResponse, isLoading: isLoadingAllVendors } =
    useGetVendorsAllDetails({ limit: 100 }, { enabled: !vendorId });

  const branches = useMemo(() => {
    if (vendorId) {
      return extractVendorBranchListItems(
        vendorBranchesResponse?.data,
        vendorId
      );
    }

    return extractVendorBranchListItems(allVendorsResponse?.data);
  }, [vendorId, vendorBranchesResponse?.data, allVendorsResponse?.data]);

  const isLoading = vendorId ? isLoadingVendorBranches : isLoadingAllVendors;

  const branchVariant = (status: 'active' | 'inactive') =>
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
          <h2 className="text-gray-500 font-medium">Branches List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px]">
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
                  Cards
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
                  <td className="p-3 text-sm text-primary-900">
                    {branch.cardCount}
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
          {isLoading && (
            <div className="p-4">
              <Text className="text-sm text-gray-500">Loading branches…</Text>
            </div>
          )}
          {!isLoading && branches.length === 0 && (
            <div className="p-4">
              <Text className="text-sm text-gray-500">
                No branches found{vendorId ? ' for this vendor' : ''}.
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
