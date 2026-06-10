import { useContentGuard, useReducerSpread } from '@/hooks';

import { DEFAULT_QUERY, formatDate, MODALS, ROUTES } from '@/utils';
import { OPTIONS } from '@/utils/constants/filter';

const CORPORATE_API_STATUSES = new Set(
  OPTIONS.CORPORATE_MANAGEMENT_STATUS.map((option) =>
    typeof option === 'string' ? option : option.value
  )
);

import { corporateManagementQueries } from './corporateQueries';
import { useAuthStore } from '@/stores';
import React, { useCallback, useMemo } from 'react';
import { usePersistedModalState } from '@/hooks';
import { useNavigate, useParams } from 'react-router';

export function useCorporateManagementBase() {
  const [query, setQuery] = useReducerSpread(DEFAULT_QUERY);
  const { userPermissions = [] } = useContentGuard();
  const paramsForApi = useParams();

  const user = useAuthStore().user;

  const {
    useGetCorporates,
    useGetCorporateDetails,
    useGetCorporateBusinessDetails,
  } = corporateManagementQueries();

  const params = useMemo(() => {
    const apiParams: any = {
      limit: query.limit || 10,
    };
    const queryWithAfter = query as any;
    if (queryWithAfter.after) {
      // Send after as date string (database expects timestamp/date format)
      apiParams.after = queryWithAfter.after;
    }
    if (query.search) {
      apiParams.search = query.search;
    }
    if (query.status && CORPORATE_API_STATUSES.has(String(query.status))) {
      apiParams.status = query.status;
    }
    if (query.date_from) {
      apiParams.date_from = String(query.date_from);
    }
    if (query.date_to) {
      apiParams.date_to = String(query.date_to);
    }
    return apiParams;
  }, [query]);

  const { data, isLoading: isLoadingCorporatesList } = useGetCorporates(params);

  const corporatesList = React.useMemo(() => {
    if (!data?.data) return [];
    return data.data.filter((corporate: any) =>
      corporate.user_type?.toLowerCase().includes('corporate')
    );
  }, [data]);

  const pagination = data?.pagination;
  const { data: corporateDetails, isLoading: isLoadingCorporateDetails } =
    useGetCorporateDetails(paramsForApi?.corporateId || '');
  const {
    data: corporateBusinessDetails,
    isLoading: isLoadingCorporateBusinessDetails,
  } = useGetCorporateBusinessDetails(params?.corporateId || '');

  const corporateInfo = React.useMemo(() => {
    if (!corporateDetails?.data) return [];

    const details = corporateDetails.data;

    return [
      {
        label: 'User ID',
        value: details.user_id || '-',
      },
      {
        label: 'Corporate ID',
        value: details.corporate_id || '-',
      },
      {
        label: 'Full Name',
        value: details.fullname || '-',
      },
      {
        label: 'Email',
        value: details.email || '-',
      },
      {
        label: 'Phone Number',
        value: details.phonenumber || '-',
      },
      {
        label: 'Country',
        value: details.country || '-',
      },
      {
        label: 'Country Code',
        value: details.country_code || '-',
      },
      {
        label: 'Street Address',
        value: details.street_address || '-',
      },
      {
        label: 'Date of Birth',
        value: details.dob ? formatDate(details.dob) : '-',
      },
      {
        label: 'ID Type',
        value: details.id_type || '-',
      },
      {
        label: 'ID Number',
        value: details.id_number || '-',
      },
      {
        label: 'User Type',
        value: details.user_type || '-',
      },
      {
        label: 'Email Verified',
        value: details.email_verified ? 'Yes' : 'No',
      },
      {
        label: 'Onboarding Stage',
        value: details.onboarding_stage || '-',
      },
      {
        label: 'Sequence Number',
        value:
          details.sequence_number != null
            ? String(details.sequence_number)
            : '-',
      },
      {
        label: 'Default Payment Option',
        value: details.default_payment_option || '-',
      },
      {
        label: 'Date Joined',
        value: details.created_at ? formatDate(details.created_at) : '-',
      },
    ];
  }, [corporateDetails]);

  const businessInfo = React.useMemo(() => {
    if (!corporateDetails?.data) return [];

    const details = corporateDetails.data;

    return [
      {
        label: 'Business Name',
        value: details.business_name || '-',
      },
      {
        label: 'Business Type',
        value: details.business_type || '-',
      },
      {
        label: 'Business Phone',
        value: details.business_phone || '-',
      },
      {
        label: 'Business Email',
        value: details.business_email || '-',
      },
      {
        label: 'Business Address',
        value: details.business_address || '-',
      },
      {
        label: 'Digital Address',
        value: details.business_digital_address || '-',
      },
      {
        label: 'Registration Number',
        value: details.registration_number || '-',
      },
      {
        label: 'Business Created',
        value: details.business_created_at
          ? formatDate(details.business_created_at)
          : '-',
      },
      {
        label: 'Business Updated',
        value: details.business_updated_at
          ? formatDate(details.business_updated_at)
          : '-',
      },
    ];
  }, [corporateDetails]);

  function getCorporateOptions({
    modal: modalInstance,
    corporate,
    option,
    loginUser,
    userPermissions: providedPermissions,
    navigate: navigateFn,
  }: {
    modal: ReturnType<typeof usePersistedModalState>;
    corporate: any;
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
    if (!corporate) return [];

    const actions = [];
    const permissionsToCheck = providedPermissions || userPermissions;
    const userToCheck = loginUser || user;

    // View option
    if (
      option?.hasView &&
      (permissionsToCheck.some(
        (p) =>
          p.toLowerCase().includes('corporates:view') ||
          p.toLowerCase().includes('corporate management view')
      ) ||
        userToCheck?.isSuperAdmin)
    ) {
      actions.push({
        label: 'View',
        onClickFn: () =>
          navigateFn(
            `${ROUTES.IN_APP.DASHBOARD.CORPORATE_DETAILS.replace(':corporateId', corporate.id)}`
          ),
      });
    }

    // Edit option
    // if (
    //   option?.hasUpdate &&
    //   (permissionsToCheck.some(
    //     (p) =>
    //       p.toLowerCase().includes('corporates:manage') ||
    //       p.toLowerCase().includes('corporate management edit')
    //   ) ||
    //     userToCheck?.isSuperAdmin)
    // ) {
    //   actions.push({
    //     label: 'Edit',
    //     onClickFn: () =>
    //       modalInstance.openModal(
    //         MODALS.CORPORATE_MANAGEMENT.CHILDREN.EDIT,
    //         corporate
    //       ),
    //   });
    // }

    // Determine corporate status - check status field
    const corporateStatus = corporate.status || corporate.approval_status || '';
    const statusLower = corporateStatus?.toLowerCase() || '';
    const isCorporateActive =
      statusLower === 'active' ||
      statusLower === 'approved' ||
      statusLower === 'verified';

    // Activate option - only show if corporate is NOT active (suspended or pending)
    if (
      !isCorporateActive &&
      option?.hasActivate &&
      (permissionsToCheck.some(
        (p) =>
          p.toLowerCase().includes('corporates:manage') ||
          p.toLowerCase().includes('corporate management deactivate/activate')
      ) ||
        userToCheck?.isSuperAdmin)
    ) {
      actions.push({
        label: 'Activate',
        onClickFn: () =>
          modalInstance.openModal(
            MODALS.CORPORATE_MANAGEMENT.CHILDREN.ACTIVATE,
            corporate
          ),
      });
    }

    // Deactivate option - only show if corporate IS active (verified or approved)
    if (
      isCorporateActive &&
      option?.hasDeactivate &&
      (permissionsToCheck.some(
        (p) =>
          p.toLowerCase().includes('corporates:manage') ||
          p.toLowerCase().includes('corporate management deactivate/activate')
      ) ||
        userToCheck?.isSuperAdmin)
    ) {
      actions.push({
        label: 'Deactivate',
        onClickFn: () =>
          modalInstance.openModal(
            MODALS.CORPORATE_MANAGEMENT.CHILDREN.DEACTIVATE,
            corporate
          ),
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
    return pagination?.hasNextPage
      ? corporatesList.length + (query.limit || 10)
      : corporatesList.length;
  }, [pagination, corporatesList.length, query.limit]);

  return {
    query,
    corporatesList,
    getCorporateOptions,
    corporateInfo,
    businessInfo,
    isLoadingCorporatesList,
    isLoadingCorporateDetails,
    isLoadingCorporateBusinessDetails,
    corporateDetails,
    corporateBusinessDetails,
    setQuery,
    pagination,
    handleNextPage,
    handleSetAfter,
    estimatedTotal,
  };
}
