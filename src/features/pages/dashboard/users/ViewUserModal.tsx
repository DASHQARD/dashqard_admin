import { Modal, Text } from '@/components';
import { usePersistedModalState } from '@/hooks';
import {
  useUserInfo,
  useUserOnboardingProgress,
} from '@/features/hooks/usersManagement';
import { formatDate } from '@/utils';
import { MODALS } from '@/utils/constants';
import React from 'react';

type UserData = {
  id: number | string;
  email?: string;
  fullname?: string;
  phonenumber?: string;
  user_type?: string;
  status?: string;
  created_at?: string;
  [key: string]: any;
};

export function ViewUserModal() {
  const modal = usePersistedModalState<UserData>({
    paramName: MODALS.CUSTOMER.ROOT,
  });

  const userData = modal.modalData;
  const userId = userData?.id ? Number(userData.id) : undefined;

  const { data: userInfo, isLoading: isLoadingUser } = useUserInfo(userId);

  const { data: onboardingProgress, isLoading: isLoadingProgress } =
    useUserOnboardingProgress(userId);

  const user = React.useMemo(() => {
    return userInfo?.data || userData;
  }, [userInfo, userData]);

  return (
    <Modal
      isOpen={modal.isModalOpen(MODALS.CUSTOMER.VIEW)}
      setIsOpen={(isOpen) => {
        if (!isOpen) {
          modal.closeModal();
        }
      }}
      title="User Details"
      position="side"
    >
      <div className="px-6 py-4 max-h-[80vh] overflow-y-auto">
        {isLoadingUser ? (
          <div className="text-center py-4">Loading user information...</div>
        ) : user ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text variant="span" className="text-gray-600">
                  Full Name
                </Text>
                <Text variant="span" className="mt-1">
                  {user.fullname || 'N/A'}
                </Text>
              </div>
              <div>
                <Text variant="span" className="text-gray-600">
                  Email
                </Text>
                <Text variant="span" className="mt-1">
                  {user.email}
                </Text>
              </div>
              <div>
                <Text variant="span" className="text-gray-600">
                  Phone Number
                </Text>
                <Text variant="span" className="mt-1">
                  {user.phonenumber || 'N/A'}
                </Text>
              </div>
              <div>
                <Text variant="span" className="text-gray-600">
                  User Type
                </Text>
                <Text variant="span" className="mt-1 capitalize">
                  {user.user_type || 'N/A'}
                </Text>
              </div>
              <div>
                <Text variant="span" className="text-gray-600">
                  Status
                </Text>
                <Text variant="span" className="mt-1 capitalize">
                  {user.status}
                </Text>
              </div>
              <div>
                <Text variant="span" className="text-gray-600">
                  Created At
                </Text>
                <Text variant="span" className="mt-1">
                  {user.created_at
                    ? formatDate(user.created_at, 'DD MMM YYYY, HH:mm')
                    : 'N/A'}
                </Text>
              </div>
            </div>

            {!isLoadingProgress && onboardingProgress?.data && (
              <div className="border-t pt-6">
                <Text variant="h6" className="mb-4">
                  Onboarding Progress
                </Text>
                <div className="space-y-3">
                  <div>
                    <Text variant="span" className="text-gray-600">
                      Current Stage
                    </Text>
                    <Text variant="span" className="mt-1 capitalize">
                      {onboardingProgress.data.stage || 'N/A'}
                    </Text>
                  </div>
                  {onboardingProgress.data.completed_steps?.length > 0 && (
                    <div>
                      <Text variant="span" className="text-gray-600">
                        Completed Steps
                      </Text>
                      <ul className="mt-1 list-disc list-inside">
                        {onboardingProgress.data.completed_steps.map(
                          (step: string, idx: number) => (
                            <li key={idx} className="capitalize">
                              {step}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                  {onboardingProgress.data.pending_steps?.length > 0 && (
                    <div>
                      <Text variant="span" className="text-gray-600">
                        Pending Steps
                      </Text>
                      <ul className="mt-1 list-disc list-inside">
                        {onboardingProgress.data.pending_steps.map(
                          (step: string, idx: number) => (
                            <li key={idx} className="capitalize">
                              {step}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4">User not found</div>
        )}
      </div>
    </Modal>
  );
}
