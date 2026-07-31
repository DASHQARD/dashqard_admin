import {
  useContentGuard,
  usePersistedModalState,
  useReducerSpread,
} from '@/hooks';

import { DEFAULT_QUERY, MODALS } from '@/utils';
import {
  canAssignAdminRole,
  hasPermissionMatch,
  isSuperAdminAccount,
} from '@/utils/helpers/role';

import { adminManagementQueries } from './adminQueries';

import { useSearch } from '@/hooks/useSearch';
import { useAuthStore } from '@/stores';
import React, { useCallback, useMemo } from 'react';

export function useAdminManagementBase() {
  const { state } = useSearch();

  const [query, setQuery] = useReducerSpread(DEFAULT_QUERY);
  const { userPermissions = [] } = useContentGuard();

  const user = useAuthStore((state) => state.user);
  const authRole = useAuthStore((state) => state.role);

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
    };
    const queryWithAfter = query as any;
    if (queryWithAfter.after) {
      // Send after as date string (API expects date string format)
      apiParams.after = queryWithAfter.after;
    }
    if (query.search) {
      apiParams.search = query.search;
    }
    if (query.status) {
      apiParams.status = query.status;
    }
    // Include date filters if present
    if (query.date_from) {
      apiParams.date_from = String(query.date_from);
    }
    if (query.date_to) {
      apiParams.date_to = String(query.date_to);
    }
    return apiParams;
  }, [query]);

  const { data: adminsResponse, isLoading: isLoadingAdminsList } =
    useGetAdmins(paramsForApi);

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
        label: 'Full Name',
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
      hasAssignRole?: boolean;
      hasResendInvite?: boolean;
    };
    loginUser: any;
    userPermissions: string[];
  }) {
    if (!admin) return [];

    const actions = [];
    const permissionsToCheck = providedPermissions || userPermissions;
    const userToCheck = loginUser || user;
    const actor =
      (authRole as Record<string, unknown> | null) ||
      (userToCheck as Record<string, unknown> | null);
    const isSuperAdmin = isSuperAdminAccount(
      userToCheck as Record<string, unknown> | null,
      authRole as Record<string, unknown> | null
    );

    const actorId = String(actor?.id ?? '');
    const targetId = String(admin.id ?? '');
    const isSelf = actorId !== '' && actorId === targetId;
    const targetIsSuperAdmin =
      String(admin.type ?? '')
        .toLowerCase()
        .replace(/\s+/g, '_') === 'super_admin' ||
      String(admin.type ?? '')
        .toLowerCase()
        .includes('super_admin');
    const canActOnTarget =
      !isSelf && (isSuperAdmin || !targetIsSuperAdmin);

    // View option
    if (
      option?.hasView &&
      (hasPermissionMatch(permissionsToCheck, [
        'admins:get',
        'admin management view',
      ]) ||
        isSuperAdmin)
    ) {
      actions.push({
        label: 'View',
        onClickFn: () => modalInstance.openModal(MODALS.ADMIN.VIEW, admin),
      });
    }

    // Edit option
    if (
      option?.hasUpdate &&
      canActOnTarget &&
      (hasPermissionMatch(permissionsToCheck, [
        'admins:update',
        'admin management edit',
      ]) ||
        isSuperAdmin)
    ) {
      actions.push({
        label: 'Edit',
        onClickFn: () => modalInstance.openModal(MODALS.ADMIN.EDIT, admin),
      });
    }

    // Change role — API requires roles:assign (roles:get alone is not enough).
    if (
      option?.hasAssignRole &&
      canActOnTarget &&
      canAssignAdminRole(permissionsToCheck)
    ) {
      actions.push({
        label: 'Change Role',
        onClickFn: () =>
          modalInstance.openModal(MODALS.ADMIN.ASSIGN_ROLE, admin),
      });
    }

    const adminStatus = String(admin.status || '').toLowerCase();
    const isAdminActive = adminStatus === 'active' || adminStatus === 'enabled';
    const isAdminDeactivated = adminStatus === 'deactivated';
    const isAdminPending = adminStatus === 'pending';

    // Activate — only for deactivated (pending cannot be activated via status API)
    if (
      isAdminDeactivated &&
      option?.hasActivate &&
      canActOnTarget &&
      (hasPermissionMatch(permissionsToCheck, [
        'admins:update',
        'admin management deactivate/activate',
      ]) ||
        isSuperAdmin)
    ) {
      actions.push({
        label: 'Activate',
        onClickFn: () =>
          modalInstance.openModal(MODALS.ADMIN.TOGGLE_STATUS, {
            ...admin,
            _statusAction: 'active',
          }),
      });
    }

    // Deactivate — only for active
    if (
      isAdminActive &&
      option?.hasDeactivate &&
      canActOnTarget &&
      (hasPermissionMatch(permissionsToCheck, [
        'admins:update',
        'admin management deactivate/activate',
      ]) ||
        isSuperAdmin)
    ) {
      actions.push({
        label: 'Deactivate',
        onClickFn: () =>
          modalInstance.openModal(MODALS.ADMIN.TOGGLE_STATUS, {
            ...admin,
            _statusAction: 'deactivated',
          }),
      });
    }

    // Resend invitation — only for pending
    if (
      isAdminPending &&
      option?.hasResendInvite &&
      canActOnTarget &&
      (hasPermissionMatch(permissionsToCheck, ['admins:create']) ||
        isSuperAdmin)
    ) {
      actions.push({
        label: 'Resend Invitation',
        onClickFn: () =>
          modalInstance.openModal(MODALS.ADMIN.RESEND_INVITE, admin),
      });
    }

    // Delete
    if (
      option?.hasDelete &&
      canActOnTarget &&
      (hasPermissionMatch(permissionsToCheck, [
        'admins:delete',
        'admin management delete',
      ]) ||
        isSuperAdmin)
    ) {
      actions.push({
        label: 'Delete',
        onClickFn: () => modalInstance.openModal(MODALS.ADMIN.REMOVE, admin),
      });
    }

    return actions;
  }

  const handleNextPage = useCallback(() => {
    if (pagination?.hasNextPage && pagination?.next) {
      // Set after as date string (API expects date string format)
      setQuery({ ...query, after: pagination.next } as any);
    }
  }, [pagination, query, setQuery]);

  const handleSetAfter = useCallback(
    (after: string) => {
      // Set after as date string or empty string to reset
      setQuery({ ...query, after: after || undefined } as any);
    },
    [query, setQuery]
  );

  // Calculate estimated total for display
  const estimatedTotal = useMemo(() => {
    const adminsArray = Array.isArray(adminsList) ? adminsList : [];
    return pagination?.hasNextPage
      ? adminsArray.length + (query.limit || 10)
      : adminsArray.length;
  }, [pagination, adminsList, query.limit]);

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
