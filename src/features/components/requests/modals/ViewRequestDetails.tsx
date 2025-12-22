import { Button, Modal, Tag, Text } from '@/components';
import { requestManagementQueries } from '@/features/hooks/requestManagement ';
import { usePersistedModalState } from '@/hooks';
import { MODALS } from '@/utils/constants';
import { formatDate, getStatusVariant } from '@/utils/helpers';

export function ViewRequestDetails() {
  const modal = usePersistedModalState<{ id: number }>({
    paramName: MODALS.REQUEST_CORPORATE_MANAGEMENT.PARAM_NAME,
  });

  const requestData = modal.modalData;

  const { useGetRequestCorporateDetails } = requestManagementQueries();
  const { data: requestCorporateDetails } = useGetRequestCorporateDetails(
    requestData?.id
  );

  return (
    <Modal
      position="side"
      title="Request Details"
      panelClass="w-[398px]"
      isOpen={modal.isModalOpen(MODALS.REQUEST_CORPORATE_MANAGEMENT.CHILDREN.VIEW)}
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
              <p className="text-gray-400 text-xs">Status</p>
              <Tag
                value={requestCorporateDetails?.status || 'Pending'}
                variant={getStatusVariant(requestData?.status || 'pending')}
                className="w-fit"
              />
            </div>

            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">Module</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {requestCorporateDetails?.module || '-'}
              </Text>
            </div>

            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">User Type</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {requestCorporateDetails?.user_type || '-'}
              </Text>
            </div>

            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">Name</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {requestCorporateDetails?.name || '-'}
              </Text>
            </div>

            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">Type</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {requestCorporateDetails?.type || '-'}
              </Text>
            </div>

            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">Description</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {requestCorporateDetails?.description || '-'}
              </Text>
            </div>

            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">Entity ID</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {requestCorporateDetails?.entity_id || '-'}
              </Text>
            </div>

            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
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
