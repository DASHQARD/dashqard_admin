import { Button, Modal, Tag, Text } from '@/components';
import { requestManagementQueries } from '@/features/hooks/requestManagement ';
import { usePersistedModalState } from '@/hooks';
import { MODALS } from '@/utils/constants';
import { formatDate, getStatusVariant } from '@/utils/helpers';
import { EntityDetailsSection } from './EntityDetailsSection';

type RequestDetailsData = {
  id?: number;
  request_id?: string;
  name?: string;
  description?: string;
  status?: string;
  module?: string;
  user_type?: string;
  type?: string;
  entity_id?: number | string;
  user_id?: number;
  initiated_by_user_id?: number | string;
  initiated_by_user_type?: string;
  initiated_by_name?: string;
  reviewed_by_name?: string;
  current_approver_level?: string;
  approval_chain?: Array<{
    level?: string;
    status?: string;
    reviewed_at?: string | null;
    approver_user_id?: number | string;
    approver_user_type?: string;
    approver_name?: string;
  }>;
  rejection_reason?: string | null;
  request_data?: Record<string, unknown>;
  access?: string;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  created_at?: string;
  updated_at?: string;
  entity_details?: Record<string, unknown>;
};

function formatLabel(key: string): string {
  return key
    .split(/[_-]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function ViewVendorRequestDetails() {
  const modal = usePersistedModalState<{ id: number }>({
    paramName: MODALS.REQUEST_VENDOR_MANAGEMENT.PARAM_NAME,
  });

  const requestData = modal.modalData;

  const { useGetRequestDetails } = requestManagementQueries();
  const { data: requestDetailsResponse } = useGetRequestDetails(
    String(requestData?.id || '')
  );

  const details: RequestDetailsData | null =
    requestDetailsResponse?.data ?? requestDetailsResponse ?? null;

  const requestId = details?.id ?? requestData?.id;
  const statusValue = (
    details?.status ?? (requestData as { status?: string })?.status
  )?.toLowerCase();
  const isPending =
    statusValue === 'pending' || Boolean(statusValue?.includes('awaiting'));

  const handleApprove = () => {
    if (requestId == null) return;
    modal.openModal(MODALS.REQUEST_VENDOR_MANAGEMENT.CHILDREN.APPROVE, {
      id: Number(requestId),
      status: 'approved',
    } as { id: number; status: string });
  };

  const handleReject = () => {
    if (requestId == null) return;
    modal.openModal(MODALS.REQUEST_VENDOR_MANAGEMENT.CHILDREN.REJECT, {
      id: Number(requestId),
      status: 'rejected',
    } as { id: number; status: string });
  };

  const DetailRow = ({
    label,
    value,
    children,
  }: {
    label: string;
    value?: React.ReactNode;
    children?: React.ReactNode;
  }) => (
    <div className="flex flex-col gap-1 pb-3 border-b border-gray-100 min-w-0">
      <p className="text-gray-400 text-xs">{label}</p>
      {children ?? (
        <Text variant="span" weight="normal" className="text-gray-800">
          {value ?? '-'}
        </Text>
      )}
    </div>
  );

  return (
    <Modal
      position="side"
      title="Request Details"
      panelClass="!w-[800px]"
      isOpen={modal.isModalOpen(MODALS.REQUEST_VENDOR_MANAGEMENT.CHILDREN.VIEW)}
      setIsOpen={(isOpen) => {
        if (!isOpen) {
          modal.closeModal();
        }
      }}
      showClose={true}
    >
      <section className="flex flex-col h-full">
        <div className="px-6 flex flex-col gap-3 flex-1 overflow-y-auto">
          <section className="flex flex-col gap-3">
            {/* Key details at the top - two columns on wide panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              <DetailRow label="Request ID" value={details?.request_id} />
              <DetailRow label="Name" value={details?.name} />
              <DetailRow
                label="Status"
                children={
                  details?.status ? (
                    <Tag
                      value={details.status}
                      variant={getStatusVariant(
                        (requestData as { status?: string })?.status ??
                          details.status ??
                          'pending'
                      )}
                      className="w-fit"
                    />
                  ) : (
                    <Text
                      variant="span"
                      weight="normal"
                      className="text-gray-800"
                    >
                      -
                    </Text>
                  )
                }
              />
              <DetailRow label="Module" value={details?.module} />
              <DetailRow label="Type" value={details?.type} />
              <DetailRow label="User Type" value={details?.user_type} />
              <DetailRow
                label="Initiated By"
                value={
                  details?.initiated_by_name ??
                  (details?.initiated_by_user_id != null
                    ? String(details.initiated_by_user_id)
                    : undefined)
                }
              />
              <DetailRow
                label="Initiated By User Type"
                value={details?.initiated_by_user_type}
              />
              <DetailRow
                label="Current Approver Level"
                value={details?.current_approver_level}
              />
              <DetailRow label="Access" value={details?.access} />
            </div>

            <DetailRow label="Description" value={details?.description} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              {details?.rejection_reason != null &&
                details.rejection_reason !== '' && (
                  <DetailRow
                    label="Rejection Reason"
                    value={details.rejection_reason}
                  />
                )}

              {(details?.reviewed_by_name || details?.reviewed_by) && (
                <DetailRow
                  label="Reviewed By"
                  value={
                    details?.reviewed_by_name ??
                    (details?.reviewed_by != null
                      ? String(details.reviewed_by)
                      : undefined)
                  }
                />
              )}

              {details?.reviewed_at != null && details.reviewed_at !== '' && (
                <DetailRow
                  label="Reviewed At"
                  value={formatDate(details.reviewed_at, 'DD MMM YYYY, HH:mm')}
                />
              )}

              <DetailRow
                label="Created At"
                value={
                  details?.created_at
                    ? formatDate(details.created_at, 'DD MMM YYYY, HH:mm')
                    : undefined
                }
              />

              <div className="flex flex-col gap-1 pb-3 border-b border-gray-100 min-w-0">
                <p className="text-gray-400 text-xs">Updated At</p>
                <Text variant="span" weight="normal" className="text-gray-800">
                  {details?.updated_at
                    ? formatDate(details.updated_at, 'DD MMM YYYY, HH:mm')
                    : '-'}
                </Text>
              </div>
            </div>

            {details?.entity_details &&
              typeof details.entity_details === 'object' && (
                <EntityDetailsSection entityDetails={details.entity_details} />
              )}

            {details?.request_data &&
              Object.keys(details.request_data).length > 0 && (
                <DetailRow
                  label="Request Data"
                  children={
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 mt-1">
                      {Object.entries(details.request_data)
                        .filter(
                          ([key]) =>
                            ![
                              'id',
                              'user_id',
                              'vendor_id',
                              'entity_id',
                            ].includes(key.toLowerCase())
                        )
                        .map(([key, val]) => (
                          <div
                            key={key}
                            className="flex justify-between gap-2 text-sm min-w-0"
                          >
                            <span className="text-gray-500 shrink-0">
                              {formatLabel(key)}:
                            </span>
                            <Text
                              variant="span"
                              weight="normal"
                              className="text-gray-800 text-right break-all"
                            >
                              {typeof val === 'object' && val !== null
                                ? JSON.stringify(val)
                                : String(val)}
                            </Text>
                          </div>
                        ))}
                    </div>
                  }
                />
              )}

            {details?.approval_chain && details.approval_chain.length > 0 && (
              <DetailRow
                label="Approval Chain"
                children={
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                    {details.approval_chain.map((step, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-gray-100 bg-gray-50 p-2 text-sm"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-gray-600 font-medium">
                            {step.level
                              ? formatLabel(step.level)
                              : `Step ${index + 1}`}
                          </span>
                          <Tag
                            value={step.status ?? 'pending'}
                            variant={getStatusVariant(step.status ?? 'pending')}
                            className="w-fit text-xs"
                          />
                        </div>
                        {(step.approver_name ||
                          step.approver_user_type != null) && (
                          <p className="text-gray-500 text-xs mt-1">
                            {step.approver_name ??
                              (step.approver_user_id != null
                                ? String(step.approver_user_id)
                                : '-')}
                            {step.approver_user_type != null &&
                              ` · ${step.approver_user_type}`}
                          </p>
                        )}
                        {step.reviewed_at && (
                          <p className="text-gray-400 text-xs mt-0.5">
                            Reviewed:{' '}
                            {formatDate(step.reviewed_at, 'DD MMM YYYY, HH:mm')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                }
              />
            )}
          </section>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <Button
            variant="outline"
            className="h-12 cursor-pointer flex-1"
            onClick={handleReject}
            disabled={!isPending}
          >
            Reject
          </Button>
          <Button
            variant="secondary"
            className="h-12 cursor-pointer flex-1"
            onClick={handleApprove}
            disabled={!isPending}
          >
            Approve
          </Button>
        </div>
      </section>
    </Modal>
  );
}
