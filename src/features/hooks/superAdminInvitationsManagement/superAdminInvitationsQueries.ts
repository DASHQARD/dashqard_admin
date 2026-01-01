import { getSuperAdminInvitations } from '@/features/services';
import { useQuery } from '@tanstack/react-query';

export function superAdminInvitationsManagementQueries() {
  function useGetSuperAdminInvitations(query?: Record<string, any>) {
    return useQuery({
      queryKey: ['super-admin-invitations', query],
      queryFn: () => getSuperAdminInvitations(query),
    });
  }

  return {
    useGetSuperAdminInvitations,
  };
}

