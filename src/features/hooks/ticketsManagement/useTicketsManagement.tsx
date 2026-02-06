import { useReducerSpread } from '@/hooks';
import { DEFAULT_QUERY } from '@/utils';
import { ticketsManagementQueries } from './ticketsQueries';
import React from 'react';

export function useTicketsManagementBase() {
  const [query, setQuery] = useReducerSpread(DEFAULT_QUERY);

  const { useGetTickets } = ticketsManagementQueries();
  const { data: ticketsList, isLoading: isLoadingTickets } = useGetTickets();

  // Filter tickets based on search query (client-side filtering)
  const filteredTicketsList = React.useMemo(() => {
    if (!query.search) return ticketsList || [];
    if (!ticketsList || !Array.isArray(ticketsList)) return [];

    const searchLower = query.search.toLowerCase();
    return ticketsList.filter((ticket: any) => {
      return (
        ticket.name?.toLowerCase().includes(searchLower) ||
        ticket.email?.toLowerCase().includes(searchLower) ||
        ticket.subject?.toLowerCase().includes(searchLower) ||
        ticket.message?.toLowerCase().includes(searchLower)
      );
    });
  }, [ticketsList, query.search]);

  return {
    query,
    setQuery,
    ticketsList: filteredTicketsList,
    isLoadingTickets,
  };
}
