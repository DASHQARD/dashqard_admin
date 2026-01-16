import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Modal, Button } from '@/components';
import { useToast } from '@/hooks';
import type { User } from '@/types/user';
import {
  useManageUserStatus,
  useUserInfo,
} from '@/features/hooks/usersManagement';

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Suspended', value: 'suspended' },
  { label: 'Verified', value: 'verified' },
];

export function ManageUserStatusModal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const userId = searchParams.get('manage-status');
  const isOpen = !!userId;

  const { data: userInfo, isLoading: isLoadingUser } = useUserInfo(
    userId ? Number(userId) : undefined
  );
  const user = userInfo?.data as User | undefined;

  const [selectedStatus, setSelectedStatus] = useState(user?.status || '');
  const { mutate: updateStatus, isPending } = useManageUserStatus();
  const toast = useToast();

  React.useEffect(() => {
    if (user?.status) {
      setSelectedStatus(user.status);
    }
  }, [user]);

  const handleClose = () => {
    searchParams.delete('manage-status');
    setSearchParams(searchParams);
  };

  const handleSubmit = () => {
    if (!user || !userId) return;

    updateStatus(
      {
        user_id: Number(userId),
        status: selectedStatus,
      },
      {
        onSuccess: () => {
          toast.success('User status updated successfully');
          handleClose();
        },
        onError: (error: any) => {
          toast.error(error?.message || 'Failed to update user status');
        },
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={(open) => !open && handleClose()}
      title="Manage User Account Status"
      position="center"
    >
      <div className="px-6 py-4">
        {isLoadingUser ? (
          <div className="text-center py-4">Loading...</div>
        ) : user ? (
          <div className="space-y-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-600">
                User Email
              </label>
              <p className="text-base font-normal text-gray-900">
                {user.email}
              </p>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-600">
                Current Status
              </label>
              <p className="text-base font-normal text-gray-900 capitalize">
                {user.status}
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">
                New Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg py-3 px-4 text-sm bg-white text-gray-900 cursor-pointer transition-colors focus:border-[#402D87] focus:outline-none focus:ring-2 focus:ring-[#402D87]/25 hover:border-gray-400"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 border-2"
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleSubmit}
                className="flex-1 bg-linear-to-br from-[#402D87] to-[#5a4fcf] text-white hover:from-[#2d1a72] hover:to-[#402D87]"
                loading={isPending}
                disabled={isPending || selectedStatus === user.status}
              >
                Update Status
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">User not found</div>
        )}
      </div>
    </Modal>
  );
}
