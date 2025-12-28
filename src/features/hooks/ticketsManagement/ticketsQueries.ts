import { getTicketsList, getTicketById } from '@/features/services';
import { useQuery } from '@tanstack/react-query';

export function ticketsManagementQueries() {
  function useGetTickets() {
    return useQuery({
      queryKey: ['tickets'],
      queryFn: () => getTicketsList(),
    });
  }

  function useGetTicketById(id: string) {
    return useQuery({
      queryKey: ['ticket', id],
      queryFn: () => getTicketById(id),
      enabled: !!id,
    });
  }

  return {
    useGetTickets,
    useGetTicketById,
  };
}
