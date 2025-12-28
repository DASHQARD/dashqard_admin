import { createTicket, updateTicketStatus } from '@/features/services';
import { useToast } from '@/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function ticketsManagementMutations() {
  function useCreateTicket() {
    const queryClient = useQueryClient();
    const { error, success } = useToast();
    return useMutation({
      mutationFn: createTicket,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tickets'] });
        success('Ticket created successfully');
      },
      onError: (err: any) => {
        error(err?.message || 'Failed to create ticket');
      },
    });
  }

  function useUpdateTicketStatus() {
    const queryClient = useQueryClient();
    const { error, success } = useToast();
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: { status?: string } }) =>
        updateTicketStatus(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tickets'] });
        queryClient.invalidateQueries({ queryKey: ['ticket'] });
        success('Ticket status updated successfully');
      },
      onError: (err: any) => {
        error(err?.message || 'Failed to update ticket status');
      },
    });
  }

  return {
    useCreateTicket,
    useUpdateTicketStatus,
  };
}
