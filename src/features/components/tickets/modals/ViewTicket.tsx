import { Button, Modal, Tag, Text } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { MODALS } from '@/utils/constants';
import { formatDate, getStatusVariant } from '@/utils/helpers';
import { ticketsManagementQueries } from '@/features/hooks/ticketsManagement';
import React from 'react';

type TicketData = {
  id: number | string;
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
};

export function ViewTicket() {
  const modal = usePersistedModalState<TicketData>({
    paramName: MODALS.TICKETS_MANAGEMENT.PARAM_NAME,
  });

  const ticketData = modal.modalData;

  const { useGetTicketById } = ticketsManagementQueries();
  const ticketId = String(ticketData?.id || '');
  const { data: ticketDetails, isLoading } = useGetTicketById(ticketId);

  const ticket = React.useMemo(() => {
    return ticketDetails ?? null;
  }, [ticketDetails]);

  if (isLoading) {
    return (
      <Modal
        panelClass="!w-[680px] min-w-full"
        title="Ticket Details"
        isOpen={modal.isModalOpen(MODALS.TICKETS_MANAGEMENT.CHILDREN.VIEW)}
        setIsOpen={modal.closeModal}
        position="side"
      >
        <div className="h-full px-6 flex flex-col gap-6 justify-center items-center">
          <Text variant="p">Loading ticket details...</Text>
        </div>
      </Modal>
    );
  }

  if (!ticket) {
    return (
      <Modal
        panelClass="!w-[680px] min-w-full"
        title="Ticket Details"
        isOpen={modal.isModalOpen(MODALS.TICKETS_MANAGEMENT.CHILDREN.VIEW)}
        setIsOpen={modal.closeModal}
        position="side"
      >
        <div className="h-full px-6 flex flex-col gap-6 justify-center items-center">
          <Text variant="p">No ticket data found</Text>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      panelClass="!w-[680px] min-w-full"
      title="Ticket Details"
      isOpen={modal.isModalOpen(MODALS.TICKETS_MANAGEMENT.CHILDREN.VIEW)}
      setIsOpen={modal.closeModal}
      position="side"
    >
      <div className="h-full px-6 flex flex-col gap-6 justify-between">
        <div className="grow overflow-y-auto py-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">Status</p>
              <Tag
                value={ticket.status || 'Pending'}
                variant={getStatusVariant(ticket.status || 'pending')}
                className="w-fit"
              />
            </div>

            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">Ticket ID</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {ticket.id || '-'}
              </Text>
            </div>

            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">Name</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {ticket.name || '-'}
              </Text>
            </div>

            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">Email</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {ticket.email || '-'}
              </Text>
            </div>

            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">Subject</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {ticket.subject || '-'}
              </Text>
            </div>

            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">Message</p>
              <Text
                variant="span"
                weight="normal"
                className="text-gray-800 whitespace-pre-wrap"
              >
                {ticket.message || '-'}
              </Text>
            </div>

            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <p className="text-gray-400 text-xs">Created At</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {ticket.created_at
                  ? formatDate(ticket.created_at, 'DD MMM YYYY, HH:mm')
                  : '-'}
              </Text>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-gray-400 text-xs">Updated At</p>
              <Text variant="span" weight="normal" className="text-gray-800">
                {ticket.updated_at
                  ? formatDate(ticket.updated_at, 'DD MMM YYYY, HH:mm')
                  : '-'}
              </Text>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-end pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={modal.closeModal}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
