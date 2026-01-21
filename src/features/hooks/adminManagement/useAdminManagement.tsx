import {
  useContentGuard,
  usePersistedModalState,
  useReducerSpread,
} from '@/hooks';

import { DEFAULT_QUERY, MODALS } from '@/utils';

import { adminManagementQueries } from './adminQueries';

import { useSearch } from '@/hooks/useSearch';
import { useAuthStore } from '@/stores';
import React, { useCallback, useMemo } from 'react';

export function useAdminManagementBase() {
  const { state } = useSearch();

  const [query, setQuery] = useReducerSpread(DEFAULT_QUERY);
  const { userPermissions = [] } = useContentGuard();

  const user = useAuthStore().user;

  React.useEffect(() => {
    if (state?.searchQuery) {
      setQuery({ ...query, search: state.searchQuery.trim() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setQuery, state?.searchQuery]);

  const { useGetAdmins } = adminManagementQueries();

  const paramsForApi = useMemo(() => {
    const apiParams: any = {
      limit: query.limit || 10,
    }
    const queryWithAfter = query as any;
    if (queryWithAfter.after) {
      // Send after as date string (API expects date string format)
      apiParams.after = queryWithAfter.after;
    }
    if (query.search) {
      apiParams.search = query.search
    }
    if (query.status) {
      apiParams.status = query.status
    }
    // Include date filters if present
    if (query.dateFrom) {
      apiParams.dateFrom = query.dateFrom
    }
    if (query.dateTo) {
      apiParams.dateTo = query.dateTo
    }
    return apiParams
  }, [query])

  const { data: adminsResponse, isLoading: isLoadingAdminsList } = useGetAdmins(paramsForApi);

  // Extract data from response
  const adminsList = React.useMemo(() => {
    if (!adminsResponse) return null;
    // Response is the full object with data array and pagination info
    if (Array.isArray(adminsResponse)) {
      return adminsResponse;
    }
    return adminsResponse.data || [];
  }, [adminsResponse]);

  const pagination = React.useMemo(() => {
    if (!adminsResponse || Array.isArray(adminsResponse)) {
      return {
        hasNextPage: false,
        hasPreviousPage: false,
        next: null,
        previous: null,
      };
    }
    return {
      hasNextPage: adminsResponse.pagination?.hasNextPage ?? false,
      hasPreviousPage: adminsResponse.pagination?.hasPreviousPage ?? false,
      next: adminsResponse.pagination?.next ?? null,
      previous: adminsResponse.pagination?.previous ?? null,
    };
  }, [adminsResponse]);

  const adminInfo = React.useMemo(() => {
    if (!adminsList || Array.isArray(adminsList)) return [];
    return [
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
  }, [adminsList]);

  function getAdminOptions({
    modal: modalInstance,
    admin,
    option,
    loginUser,
    userPermissions: providedPermissions,
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
        onClickFn: () => modalInstance.openModal(MODALS.ADMIN.VIEW, admin),
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

    // Determine admin status
    const adminStatus = admin.status || '';
    const isAdminActive =
      adminStatus?.toLowerCase() === 'active' ||
      adminStatus?.toLowerCase() === 'enabled';

    // Activate option - only show if admin is NOT active
    if (
      !isAdminActive &&
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

    // Deactivate option - only show if admin IS active
    if (
      isAdminActive &&
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

  const handleNextPage = useCallback(() => {
    if (pagination?.hasNextPage && pagination?.next) {
      // Set after as date string (API expects date string format)
      setQuery({ ...query, after: pagination.next } as any)
    }
  }, [pagination, query, setQuery])

  const handleSetAfter = useCallback(
    (after: string) => {
      // Set after as date string or empty string to reset
      setQuery({ ...query, after: after || undefined } as any)
    },
    [query, setQuery],
  )

  // Calculate estimated total for display
  const estimatedTotal = useMemo(() => {
    const adminsArray = Array.isArray(adminsList) ? adminsList : [];
    return pagination?.hasNextPage
      ? adminsArray.length + (query.limit || 10)
      : adminsArray.length
  }, [pagination, adminsList, query.limit])

  return {
    query,
    adminsList: Array.isArray(adminsList) ? adminsList : [],
    getAdminOptions,
    adminInfo,
    isLoadingAdminsList,
    setQuery,
    pagination,
    handleNextPage,
    handleSetAfter,
    estimatedTotal,
  };
}
