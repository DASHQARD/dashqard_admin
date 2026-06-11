import {
  createCountry,
  updateCountry,
  deleteCountry,
  updateCountryStatus,
} from '@/features/services';
import type {
  CreateCountryPayload,
  UpdateCountryPayload,
  UpdateCountryStatusPayload,
} from '@/types/countries';
import { useToast } from '@/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function countriesManagementMutations() {
  function useCreateCountry() {
    const queryClient = useQueryClient();
    const { error, success } = useToast();
    return useMutation({
      mutationFn: (data: CreateCountryPayload) => createCountry(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['countries'] });
        success('Country created successfully');
      },
      onError: (err: { message?: string }) => {
        error(err?.message || 'Failed to create country');
      },
    });
  }

  function useUpdateCountry() {
    const queryClient = useQueryClient();
    const { error, success } = useToast();
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: UpdateCountryPayload }) =>
        updateCountry(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['countries'] });
        queryClient.invalidateQueries({ queryKey: ['country'] });
        success('Country updated successfully');
      },
      onError: (err: { message?: string }) => {
        error(err?.message || 'Failed to update country');
      },
    });
  }

  function useDeleteCountry() {
    const queryClient = useQueryClient();
    const { error, success } = useToast();
    return useMutation({
      mutationFn: deleteCountry,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['countries'] });
        success('Country deleted successfully');
      },
      onError: (err: { message?: string }) => {
        error(err?.message || 'Failed to delete country');
      },
    });
  }

  function useUpdateCountryStatus() {
    const queryClient = useQueryClient();
    const { error, success } = useToast();
    return useMutation({
      mutationFn: ({
        id,
        data,
      }: {
        id: string;
        data: UpdateCountryStatusPayload;
      }) => updateCountryStatus(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['countries'] });
        queryClient.invalidateQueries({ queryKey: ['country'] });
        success('Country status updated successfully');
      },
      onError: (err: { message?: string }) => {
        error(err?.message || 'Failed to update country status');
      },
    });
  }

  return {
    useCreateCountry,
    useUpdateCountry,
    useDeleteCountry,
    useUpdateCountryStatus,
  };
}
