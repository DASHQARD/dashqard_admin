import {
  useContentGuard,
  usePersistedModalState,
  useReducerSpread,
} from '@/hooks';

import { DEFAULT_QUERY, MODALS, ROUTES } from '@/utils';

import { adminManagementQueries } from './adminQueries';
import { useNavigate } from 'react-router';
import { useSearch } from '@/hooks/useSearch';
import { useAuthStore } from '@/stores';
import React from 'react';

export function useAdminManagementBase() {
  const { state } = useSearch();

  const [query, setQuery] = useReducerSpread(DEFAULT_QUERY);
  const { userPermissions = [] } = useContentGuard();

  const user = useAuthStore().user;

  React.useEffect(() => {
    if (state?.searchQuery) {
      setQuery({ ...query, page: 1, search: state.searchQuery.trim() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setQuery, state?.searchQuery]);

  const { useGetAdmins } = adminManagementQueries();
  const { data: adminsList, isLoading: isLoadingAdminsList } = useGetAdmins();

  console.log('adminsList', adminsList);

  const adminInfo = [
    {
      label: 'Email',
      value: adminsList?.email || '-',
    },
    {
      label: 'Status',
      value: adminsList?.status || '-',
    },
    {
      label: 'First Name',
      value: adminsList?.first_name || '-',
    },
    {
      label: 'Last Name',
      value: adminsList?.last_name || '-',
    },
    {
      label: 'Phone Number',
      value: adminsList?.phone_number || '-',
    },
    {
      label: 'Profile Image',
      value: adminsList?.profileImage || '-',
    },
  ];

  function getAdminOptions({
    modal: modalInstance,
    admin,
    option,
    loginUser,
    userPermissions: providedPermissions,
    navigate: navigateFn,
  }: {
    modal: ReturnType<typeof usePersistedModalState>;
    admin: any;
    option: {
      hasView?: boolean;
      hasUpdate?: boolean;
      hasDelete?: boolean;
      hasActivate?: boolean;
      hasDeactivate?: boolean;
    };
    loginUser: any;
    userPermissions: string[];
    navigate: ReturnType<typeof useNavigate>;
  }) {
    if (!admin) return [];

    const actions = [];
    const permissionsToCheck = providedPermissions || userPermissions;
    const userToCheck = loginUser || user;

    // View option
    if (
      option?.hasView &&
      (permissionsToCheck.some(
        (p) =>
          p.toLowerCase().includes('admins:get') ||
          p.toLowerCase().includes('admin management view')
      ) ||
        userToCheck?.isSuperAdmin)
    ) {
      actions.push({
        label: 'View',
        onClickFn: () =>
          navigateFn(`${ROUTES.IN_APP.ADMIN.ADMINS}/${admin.id}`),
      });
    }

    // Edit option
    if (
      option?.hasUpdate &&
      (permissionsToCheck.some(
        (p) =>
          p.toLowerCase().includes('admins:update') ||
          p.toLowerCase().includes('admin management edit')
      ) ||
        userToCheck?.isSuperAdmin)
    ) {
      actions.push({
        label: 'Edit',
        onClickFn: () => modalInstance.openModal(MODALS.ADMIN.EDIT, admin),
      });
    }

    // Activate option
    if (
      option?.hasActivate &&
      (permissionsToCheck.some(
        (p) =>
          p.toLowerCase().includes('admins:update') ||
          p.toLowerCase().includes('admin management deactivate/activate')
      ) ||
        userToCheck?.isSuperAdmin)
    ) {
      actions.push({
        label: 'Activate',
        onClickFn: () =>
          modalInstance.openModal(MODALS.ADMIN.TOGGLE_STATUS, admin),
      });
    }

    // Deactivate option
    if (
      option?.hasDeactivate &&
      (permissionsToCheck.some(
        (p) =>
          p.toLowerCase().includes('admins:update') ||
          p.toLowerCase().includes('admin management deactivate/activate')
      ) ||
        userToCheck?.isSuperAdmin)
    ) {
      actions.push({
        label: 'Deactivate',
        onClickFn: () =>
          modalInstance.openModal(MODALS.ADMIN.TOGGLE_STATUS, admin),
      });
    }

    return actions;
  }

  return {
    query,
    adminsList,
    getAdminOptions,
    adminInfo,
    isLoadingAdminsList,
    setQuery,
  };
}
