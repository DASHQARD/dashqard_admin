import { Button, Modal, Tag, Text } from '@/components';
import { requestManagementQueries } from '@/features/hooks/requestManagement ';
import { usePersistedModalState } from '@/hooks';
import { MODALS } from '@/utils/constants';
import { formatDate, getStatusVariant } from '@/utils/helpers';

export function ViewVendorRequestDetails() {
  const modal = usePersistedModalState<{ id: number }>({
    paramName: MODALS.REQUEST_VENDOR_MANAGEMENT.PARAM_NAME,
  });

  const requestData = modal.modalData;

  const { useGetRequestDetails } = requestManagementQueries();
  const { data: requestDetails } = useGetRequestDetails(
    String(requestData?.id || '')
  );

  return (
    <Modal
      position="side"
      title="Request Details"
      panelClass="w-[398px]"
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
            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">Request ID</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {requestDetails?.request_id || '-'}
              </Text>
            </div>

            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">Status</p>
              <Tag
                value={requestDetails?.status || 'Pending'}
                variant={getStatusVariant((requestData as any)?.status || requestDetails?.status || 'pending')}
                className="w-fit"
              />
            </div>

            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">Module</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {requestDetails?.module || '-'}
              </Text>
            </div>

            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">User Type</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {requestDetails?.user_type || '-'}
              </Text>
            </div>

            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">Name</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {requestDetails?.name || '-'}
              </Text>
            </div>

            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">Type</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {requestDetails?.type || '-'}
              </Text>
            </div>

            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">Description</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {requestDetails?.description || '-'}
              </Text>
            </div>

            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">Entity ID</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {requestDetails?.entity_id || '-'}
              </Text>
            </div>

            {requestDetails?.reviewed_by && (
              <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
                <p className="text-gray-400 text-xs">Reviewed By</p>
                <Text variant="span" weight="normal" className="text-gray-800">
                  {requestDetails.reviewed_by}
                </Text>
              </div>
            )}

            {requestDetails?.reviewed_at && (
              <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
                <p className="text-gray-400 text-xs">Reviewed At</p>
                <Text variant="span" weight="normal" className="text-gray-800">
                  {formatDate(requestDetails.reviewed_at, 'DD MMM YYYY, HH:mm')}
                </Text>
              </div>
            )}

            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">Created At</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {requestDetails?.created_at
                  ? formatDate(
                      requestDetails.created_at,
                      'DD MMM YYYY, HH:mm'
                    )
                  : '-'}
              </Text>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-gray-400 text-xs">Updated At</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {requestDetails?.updated_at
                  ? formatDate(
                      requestDetails.updated_at,
                      'DD MMM YYYY, HH:mm'
                    )
                  : '-'}
              </Text>
            </div>
          </section>
        </div>
        <div className="px-6 py-4 border-t border-gray-100">
          <Button
            variant="outline"
            className="h-12 cursor-pointer w-full"
            onClick={modal.closeModal}
          >
            Close
          </Button>
        </div>
      </section>
    </Modal>
  );
}

