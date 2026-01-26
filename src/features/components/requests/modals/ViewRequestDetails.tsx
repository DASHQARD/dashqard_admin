import { Button, Modal, Tag, Text } from '@/components';
import { requestManagementQueries } from '@/features/hooks/requestManagement ';
import { usePersistedModalState } from '@/hooks';
import { MODALS } from '@/utils/constants';
import { formatDate, getStatusVariant } from '@/utils/helpers';

export function ViewRequestDetails() {
  const modal = usePersistedModalState<{ id: number } | { id: string; status: string }>({
    paramName: MODALS.REQUEST_CORPORATE_MANAGEMENT.PARAM_NAME,
  });

  const requestData = modal.modalData;

  const { useGetRequestCorporateDetails } = requestManagementQueries();
  const { data: requestCorporateDetails } = useGetRequestCorporateDetails(
    String(requestData?.id || '')
  );

  return (
    <Modal
      position="side"
      title="Request Details"
      panelClass="!w-[1100px]"
      isOpen={modal.isModalOpen(MODALS.REQUEST_CORPORATE_MANAGEMENT.CHILDREN.VIEW)}
      setIsOpen={(isOpen) => {
        if (!isOpen) {
          modal.closeModal();
        }
      }}
      showClose={true}
    >
      <section className="flex flex-col h-full">
        <div className="px-6 py-4 flex flex-col gap-6 flex-1 overflow-y-auto">
          {/* Header Section */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div className="flex flex-col gap-1">
              <p className="text-gray-400 text-xs">Request ID</p>
              <Text variant="span" weight="normal" className="text-gray-800 text-base">
                {requestCorporateDetails?.request_id || '-'}
              </Text>
            </div>
            <div className="flex flex-col gap-1 items-end">
              <p className="text-gray-400 text-xs">Status</p>
              <Tag
                value={requestCorporateDetails?.status || 'Pending'}
                variant={getStatusVariant((requestData as any)?.status || requestCorporateDetails?.status || 'pending')}
                className="w-fit"
              />
            </div>
          </div>

          {/* Basic Information - Two Column Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <p className="text-gray-400 text-xs">Module</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {requestCorporateDetails?.module || '-'}
              </Text>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-gray-400 text-xs">User Type</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {requestCorporateDetails?.user_type || '-'}
              </Text>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-gray-400 text-xs">Name</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {requestCorporateDetails?.name || '-'}
              </Text>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-gray-400 text-xs">Type</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {requestCorporateDetails?.type || '-'}
              </Text>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-gray-400 text-xs">Entity ID</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {requestCorporateDetails?.entity_id || '-'}
              </Text>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-gray-400 text-xs">User ID</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {requestCorporateDetails?.user_id || '-'}
              </Text>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-gray-400 text-xs">Access</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {requestCorporateDetails?.access || '-'}
              </Text>
            </div>

            {requestCorporateDetails?.current_approver_level && (
              <div className="flex flex-col gap-1">
                <p className="text-gray-400 text-xs">Current Approver Level</p>
                <Text variant="span" weight="normal" className="text-gray-800">
                  {requestCorporateDetails.current_approver_level}
                </Text>
              </div>
            )}

            {requestCorporateDetails?.initiated_by_user_id && (
              <div className="flex flex-col gap-1">
                <p className="text-gray-400 text-xs">Initiated By User ID</p>
                <Text variant="span" weight="normal" className="text-gray-800">
                  {requestCorporateDetails.initiated_by_user_id}
                </Text>
              </div>
            )}

            {requestCorporateDetails?.initiated_by_user_type && (
              <div className="flex flex-col gap-1">
                <p className="text-gray-400 text-xs">Initiated By User Type</p>
                <Text variant="span" weight="normal" className="text-gray-800">
                  {requestCorporateDetails.initiated_by_user_type}
                </Text>
              </div>
            )}

            {requestCorporateDetails?.reviewed_by && (
              <div className="flex flex-col gap-1">
                <p className="text-gray-400 text-xs">Reviewed By</p>
                <Text variant="span" weight="normal" className="text-gray-800">
                  {requestCorporateDetails.reviewed_by}
                </Text>
              </div>
            )}

            {requestCorporateDetails?.reviewed_at && (
              <div className="flex flex-col gap-1">
                <p className="text-gray-400 text-xs">Reviewed At</p>
                <Text variant="span" weight="normal" className="text-gray-800">
                  {formatDate(requestCorporateDetails.reviewed_at, 'DD MMM YYYY, HH:mm')}
                </Text>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <p className="text-gray-400 text-xs">Created At</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {requestCorporateDetails?.created_at
                  ? formatDate(
                    requestCorporateDetails.created_at,
                    'DD MMM YYYY, HH:mm'
                  )
                  : '-'}
              </Text>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-gray-400 text-xs">Updated At</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {requestCorporateDetails?.updated_at
                  ? formatDate(
                    requestCorporateDetails.updated_at,
                    'DD MMM YYYY, HH:mm'
                  )
                  : '-'}
              </Text>
            </div>
          </div>

          {/* Description - Full Width */}
          {requestCorporateDetails?.description && (
            <div className="flex flex-col gap-1 pb-4 border-b border-gray-200">
              <p className="text-gray-400 text-xs">Description</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {requestCorporateDetails.description}
              </Text>
            </div>
          )}

          {/* Rejection Reason - Full Width */}
          {requestCorporateDetails?.rejection_reason && (
            <div className="flex flex-col gap-1 pb-4 border-b border-gray-200">
              <p className="text-gray-400 text-xs">Rejection Reason</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {requestCorporateDetails.rejection_reason}
              </Text>
            </div>
          )}

          {/* Approval Chain */}
          {requestCorporateDetails?.approval_chain &&
            requestCorporateDetails.approval_chain.length > 0 && (
              <div className="flex flex-col gap-3 pb-4 border-b border-gray-200">
                <p className="text-gray-600 text-sm font-medium">Approval Chain</p>
                <div className="grid grid-cols-2 gap-4">
                  {requestCorporateDetails.approval_chain.map(
                    (
                      approval: {
                        level?: string;
                        status?: string;
                        reviewed_at?: string | null;
                        approver_user_id?: number;
                        approver_user_type?: string;
                      },
                      index: number
                    ) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <p className="text-gray-400 text-xs">Level</p>
                            <Text variant="span" weight="normal" className="text-gray-800 text-sm">
                              {approval.level || '-'}
                            </Text>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-gray-400 text-xs">Status</p>
                            <Tag
                              value={approval.status || 'Pending'}
                              variant={getStatusVariant(approval.status || 'pending')}
                              className="w-fit"
                            />
                          </div>
                          {approval.approver_user_id && (
                            <div className="flex items-center justify-between">
                              <p className="text-gray-400 text-xs">Approver User ID</p>
                              <Text variant="span" weight="normal" className="text-gray-800 text-sm">
                                {approval.approver_user_id}
                              </Text>
                            </div>
                          )}
                          {approval.approver_user_type && (
                            <div className="flex items-center justify-between">
                              <p className="text-gray-400 text-xs">Approver User Type</p>
                              <Text variant="span" weight="normal" className="text-gray-800 text-sm">
                                {approval.approver_user_type}
                              </Text>
                            </div>
                          )}
                          {approval.reviewed_at && (
                            <div className="flex items-center justify-between">
                              <p className="text-gray-400 text-xs">Reviewed At</p>
                              <Text variant="span" weight="normal" className="text-gray-800 text-sm">
                                {formatDate(approval.reviewed_at, 'DD MMM YYYY, HH:mm')}
                              </Text>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

          {/* Request Data - Side by Side Comparison */}
          {requestCorporateDetails?.request_data && (
            <div className="flex flex-col gap-4 pb-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-gray-600 text-sm font-medium">Request Data</p>
                {requestCorporateDetails.request_data.fields_to_update && (
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(
                      requestCorporateDetails.request_data.fields_to_update
                    ).map((field) => (
                      <Tag
                        key={field}
                        value={field.replace(/_/g, ' ')}
                        variant="gray"
                        className="w-fit"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Current Data */}
                {requestCorporateDetails.request_data.current_data && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-600 text-xs font-medium mb-3 pb-2 border-b border-gray-200">
                      Current Data
                    </p>
                    <div className="flex flex-col gap-3">
                      {Object.entries(
                        requestCorporateDetails.request_data.current_data
                      ).map(([key, value]) => (
                        <div key={key} className="flex flex-col gap-1">
                          <p className="text-gray-400 text-xs capitalize">
                            {key.replace(/_/g, ' ')}
                          </p>
                          <Text variant="span" weight="normal" className="text-gray-800 text-sm">
                            {key.includes('_at') && typeof value === 'string'
                              ? formatDate(value, 'DD MMM YYYY, HH:mm')
                              : String(value || '-')}
                          </Text>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Proposed Data */}
                {requestCorporateDetails.request_data.proposed_data && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-gray-600 text-xs font-medium mb-3 pb-2 border-b border-green-200">
                      Proposed Data
                    </p>
                    <div className="flex flex-col gap-3">
                      {Object.entries(
                        requestCorporateDetails.request_data.proposed_data
                      ).map(([key, value]) => (
                        <div key={key} className="flex flex-col gap-1">
                          <p className="text-gray-400 text-xs capitalize">
                            {key.replace(/_/g, ' ')}
                          </p>
                          <Text variant="span" weight="normal" className="text-gray-800 text-sm">
                            {key.includes('_at') && typeof value === 'string'
                              ? formatDate(value, 'DD MMM YYYY, HH:mm')
                              : String(value || '-')}
                          </Text>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-gray-100">
          <div className="flex justify-end items-center gap-3">
            {requestCorporateDetails?.status?.toLowerCase() === 'pending' ? (
              <>
                <Button
                  variant="danger"
                  onClick={() => {
                    modal.openModal(MODALS.REQUEST_CORPORATE_MANAGEMENT.CHILDREN.REJECT, {
                      id: requestCorporateDetails?.id ? String(requestCorporateDetails.id) : '',
                      status: 'rejected',
                    } as any);
                  }}
                >
                  Reject
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    modal.openModal(MODALS.REQUEST_CORPORATE_MANAGEMENT.CHILDREN.APPROVE, {
                      id: requestCorporateDetails?.id ? String(requestCorporateDetails.id) : '',
                      status: 'approved',
                    } as any);
                  }}
                >
                  Approve
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                className="h-12 cursor-pointer w-full"
                onClick={modal.closeModal}
              >
                Close
              </Button>
            )}
          </div>
        </div>
      </section>
    </Modal>
  );
}
