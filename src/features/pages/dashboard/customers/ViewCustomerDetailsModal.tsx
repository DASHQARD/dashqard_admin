import { Modal, Text } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { useUserOnboardingProgress } from '@/features/hooks/usersManagement';
import { formatDate } from '@/utils';
import { MODALS } from '@/utils/constants';
import type { Customer } from '@/types/customer';

export function ViewCustomerDetailsModal() {
  const modal = usePersistedModalState<Customer>({
    paramName: MODALS.CUSTOMER.ROOT,
  });

  const customerData = modal.modalData;
  const customerId = customerData?.id ? Number(customerData.id) : undefined;

  // Get onboarding progress for the customer
  // Use customer.id as the user_id for the onboarding progress endpoint
  const { data: onboardingProgress, isLoading: isLoadingProgress } =
    useUserOnboardingProgress(customerId);

  console.log('onboardingProgress', onboardingProgress);

  const progressData = onboardingProgress;
  const customer = customerData;

  return (
    <Modal
      isOpen={modal.isModalOpen(MODALS.CUSTOMER.VIEW)}
      setIsOpen={(isOpen) => {
        if (!isOpen) {
          modal.closeModal();
        }
      }}
      title="Customer Details"
      position="side"
    >
      <div className="px-6 py-4 max-h-[80vh] overflow-y-auto">
        {isLoadingProgress ? (
          <div className="text-center py-4">
            Loading customer information...
          </div>
        ) : (
          <div className="space-y-6">
            {/* Customer Basic Info */}
            {customer && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text variant="span" className="text-gray-600">
                    Full Name
                  </Text>
                  <Text variant="span" className="mt-1">
                    {customer.fullname || 'N/A'}
                  </Text>
                </div>
                <div>
                  <Text variant="span" className="text-gray-600">
                    Email
                  </Text>
                  <Text variant="span" className="mt-1">
                    {customer.email}
                  </Text>
                </div>
                <div>
                  <Text variant="span" className="text-gray-600">
                    Phone Number
                  </Text>
                  <Text variant="span" className="mt-1">
                    {customer.phonenumber || 'N/A'}
                  </Text>
                </div>
                <div>
                  <Text variant="span" className="text-gray-600">
                    Status
                  </Text>
                  <Text variant="span" className="mt-1 capitalize">
                    {customer.status}
                  </Text>
                </div>
                <div>
                  <Text variant="span" className="text-gray-600">
                    Created At
                  </Text>
                  <Text variant="span" className="mt-1">
                    {customer.created_at
                      ? formatDate(customer.created_at, 'DD MMM YYYY, HH:mm')
                      : 'N/A'}
                  </Text>
                </div>
              </div>
            )}

            {/* Onboarding Progress */}
            {progressData && (
              <div className="border-t pt-6">
                <Text variant="h6" className="mb-4">
                  Onboarding Progress
                </Text>
                <div className="space-y-4">
                  <div>
                    <Text variant="span" className="text-gray-600">
                      Current Stage
                    </Text>
                    <Text variant="span" className="mt-1 capitalize">
                      {progressData.current_stage?.replace(/_/g, ' ') || 'N/A'}
                    </Text>
                  </div>

                  <div>
                    <Text variant="span" className="text-gray-600 mb-2 block">
                      Progress Status
                    </Text>
                    <div className="space-y-2">
                      {[
                        { key: 'sign_up_completed', label: 'Sign Up' },
                        {
                          key: 'personal_details_completed',
                          label: 'Personal Details',
                        },
                        { key: 'upload_id_completed', label: 'Upload ID' },
                        {
                          key: 'payment_details_completed',
                          label: 'Payment Details',
                        },
                        {
                          key: 'business_details_completed',
                          label: 'Business Details',
                        },
                        {
                          key: 'business_documents_completed',
                          label: 'Business Documents',
                        },
                        {
                          key: 'branch_details_completed',
                          label: 'Branch Details',
                        },
                      ].map(({ key, label }) => {
                        const isCompleted =
                          progressData[key as keyof typeof progressData];
                        const completedAt = progressData[
                          `${key}_at` as keyof typeof progressData
                        ] as string | null;
                        return (
                          <div
                            key={key}
                            className="flex items-center justify-between p-2 rounded bg-gray-50"
                          >
                            <span className="text-sm">{label}</span>
                            <div className="flex items-center gap-2">
                              {isCompleted ? (
                                <>
                                  <span className="text-green-600 text-sm">
                                    ✓ Completed
                                  </span>
                                  {completedAt && (
                                    <span className="text-xs text-gray-500">
                                      {formatDate(completedAt, 'DD MMM YYYY')}
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="text-gray-400 text-sm">
                                  Pending
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <Text variant="span" className="text-gray-600">
                        Overall Onboarding Status
                      </Text>
                      <Text
                        variant="span"
                        className={
                          progressData.onboarding_completed
                            ? 'text-green-600'
                            : 'text-orange-600'
                        }
                      >
                        {progressData.onboarding_completed
                          ? 'Completed'
                          : 'In Progress'}
                      </Text>
                    </div>
                    {progressData.completed_at && (
                      <Text variant="span" className="text-gray-500 mt-1">
                        Completed on:{' '}
                        {formatDate(
                          progressData.completed_at,
                          'DD MMM YYYY, HH:mm'
                        )}
                      </Text>
                    )}
                  </div>

                  {progressData.user_type && (
                    <div>
                      <Text variant="span" className="text-gray-600">
                        User Type
                      </Text>
                      <Text variant="span" className="mt-1 capitalize">
                        {progressData.user_type}
                      </Text>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
