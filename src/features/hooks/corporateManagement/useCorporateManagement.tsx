import { useContentGuard, useReducerSpread } from '@/hooks';

import { DEFAULT_QUERY, formatDate, MODALS, ROUTES } from '@/utils';

import { corporateManagementQueries } from './corporateQueries';
import { useSearch } from '@/hooks/useSearch';
import { useAuthStore } from '@/stores';
import React from 'react';
import { usePersistedModalState } from '@/hooks';
import { useNavigate, useParams } from 'react-router';
import { DateCell } from '@/components';

export function useCorporateManagementBase() {
  const { state } = useSearch();
  const params = useParams();

  const [query, setQuery] = useReducerSpread(DEFAULT_QUERY);
  const { userPermissions = [] } = useContentGuard();

  const user = useAuthStore().user;

  React.useEffect(() => {
    if (state?.searchQuery) {
      setQuery({ ...query, page: 1, search: state.searchQuery.trim() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setQuery, state?.searchQuery]);

  const {
    useGetCorporates,
    useGetCorporateDetails,
    useGetCorporateBusinessDetails,
  } = corporateManagementQueries();
  const { data, isLoading: isLoadingCorporatesList } = useGetCorporates();

  const corporatesList = React.useMemo(() => {
    if (!data) return [];
    return data.filter((corporate: any) =>
      corporate.user_type?.toLowerCase().includes('corporate')
    );
  }, [data]);
  const { data: corporateDetails, isLoading: isLoadingCorporateDetails } =
    useGetCorporateDetails(params?.corporateId || '');
  const {
    data: corporateBusinessDetails,
    isLoading: isLoadingCorporateBusinessDetails,
  } = useGetCorporateBusinessDetails(params?.corporateId || '');

  console.log('corporateDetails inside', corporatesList);

  const corporateInfo = React.useMemo(() => {
    if (!corporateDetails?.data) return [];

    const details = corporateDetails.data;

    return [
      {
        label: 'User ID',
        value: details.corporate_id || '-',
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
        label: 'Date Joined',
        value: details.created_at ? formatDate(details.created_at) : '-',
      },
    ];
  }, [corporateDetails]);

  const businessInfo = React.useMemo(() => {
    if (!corporateDetails) return [];

    return [
      {
        label: 'Business Name',
        value: corporateDetails?.business_name || '-',
      },
      {
        label: 'Business Type',
        value: corporateDetails?.business_type || '-',
      },
      {
        label: 'Business Phone',
        value: corporateDetails?.business_phone || '-',
      },
      {
        label: 'Business Email',
        value: corporateDetails?.business_email || '-',
      },
      {
        label: 'Business Address',
        value: corporateDetails?.business_address || '-',
      },
      {
        label: 'Digital Address',
        value: corporateDetails?.business_digital_address || '-',
      },
      {
        label: 'Registration Number',
        value: corporateDetails?.registration_number || '-',
      },
      {
        label: 'Business Created',
        value: DateCell,
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
    if (
      option?.hasUpdate &&
      (permissionsToCheck.some(
        (p) =>
          p.toLowerCase().includes('corporates:manage') ||
          p.toLowerCase().includes('corporate management edit')
      ) ||
        userToCheck?.isSuperAdmin)
    ) {
      actions.push({
        label: 'Edit',
        onClickFn: () =>
          modalInstance.openModal(
            MODALS.CORPORATE_MANAGEMENT.CHILDREN.EDIT,
            corporate
          ),
      });
    }

    // Activate option
    if (
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

    // Deactivate option
    if (
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
  };
}
