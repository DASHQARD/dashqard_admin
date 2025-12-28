import { PaginatedTable, Text } from '@/components';

import {
  ticketListColumns,
  ticketListCsvHeaders,
  ViewTicket,
  UpdateTicketStatus,
} from '@/features/components/tickets';
import { useTicketsManagementBase } from '@/features/hooks/ticketsManagement';

export default function Tickets() {
  const { ticketsList, isLoadingTickets, query, setQuery } =
    useTicketsManagementBase();

  return (
    <>
      <div className="lg:py-10">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <Text variant="h2" weight="semibold" className="text-primary-900">
              Tickets Management
            </Text>
          </div>
          <div className="relative space-y-[37px]">
            <div className="text-[#0c4b77] py-2 border-b-2 border-[#0c4b77] w-fit">
              <Text variant="h6" weight="medium">
                All Tickets
              </Text>
            </div>
            <PaginatedTable
              filterWrapperClassName="lg:absolute lg:top-0 lg:right-[2px]"
              columns={ticketListColumns}
              data={ticketsList || []}
              total={ticketsList?.length || 0}
              loading={isLoadingTickets}
              query={query}
              setQuery={setQuery}
              searchPlaceholder="Search by name, email, or subject..."
              csvHeaders={ticketListCsvHeaders}
              filterBy={{
                simpleSelects: [
                  {
                    label: 'status',
                    options: [
                      { label: 'Open', value: 'open' },
                      { label: 'In Progress', value: 'in_progress' },
                      { label: 'Resolved', value: 'resolved' },
                      { label: 'Closed', value: 'closed' },
                    ],
                  },
                ],
              }}
              printTitle="Tickets"
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <ViewTicket />
      <UpdateTicketStatus />
    </>
  );
}

