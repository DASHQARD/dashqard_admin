import { formatDate } from '@/utils';
import { vendorManagementQueries } from './vendorQueries';
import React from 'react';
import { useParams } from 'react-router';

export function useVendorDetailsManagementBase() {
  const params = useParams();

  const {
    useGetVendorDetails,
  } = vendorManagementQueries();
  const { data: vendorDetailsResponse, isLoading: isLoadingVendorDetails } =
    useGetVendorDetails(params?.vendorId || '');

  // Extract data from response - handle both direct data and nested data.data
  const vendorDetails = vendorDetailsResponse?.data || vendorDetailsResponse;

  const vendorInfo = React.useMemo(() => {
    if (!vendorDetails) return [];

    return [
      {
        label: 'Account ID',
        value: vendorDetails.id != null ? String(vendorDetails.id) : '-',
      },
      {
        label: 'Vendor ID',
        value: vendorDetails.vendor_id != null ? String(vendorDetails.vendor_id) : '-',
      },
      {
        label: 'GV ID',
        value: vendorDetails.gvid || '-',
      },
      {
        label: 'Vendor User ID',
        value: vendorDetails.vendor_user_id != null ? String(vendorDetails.vendor_user_id) : '-',
      },
      {
        label: 'Name',
        value: vendorDetails.vendor_name || vendorDetails.business_name || vendorDetails.vendor_email || '-',
      },
      {
        label: 'Email',
        value: vendorDetails.vendor_email || '-',
      },
      {
        label: 'Phone',
        value: vendorDetails.vendor_phone || '-',
      },
      {
        label: 'User Type',
        value: vendorDetails.vendor_user_type || '-',
      },
      {
        label: 'Vendor Status',
        value: vendorDetails.vendor_status || '-',
      },
      {
        label: 'Onboarding Stage',
        value: vendorDetails.onboarding_stage ?? '-',
      },
      {
        label: 'Onboarding Completed',
        value: vendorDetails.onboarding_completed == null
          ? '-'
          : vendorDetails.onboarding_completed
            ? 'Yes'
            : 'No',
      },
      {
        label: 'Branch Count',
        value: vendorDetails.branch_count || '-',
      },
      {
        label: 'Date Joined',
        value: vendorDetails.created_at ? formatDate(vendorDetails.created_at) : '-',
      },
    ];
  }, [vendorDetails]);

  const corporateInfo = React.useMemo(() => {
    if (!vendorDetails) return [];

    const businessInfo = vendorDetails.business_information;

    return [
      {
        label: 'Corporate User ID',
        value: vendorDetails.corporate_user_id || '-',
      },
      {
        label: 'Corporate Name',
        value: vendorDetails.corporate_name || '-',
      },
      {
        label: 'Corporate Email',
        value: vendorDetails.corporate_email || '-',
      },
      {
        label: 'Business Name',
        value: vendorDetails.business_name || '-',
      },
      {
        label: 'Business Type',
        value: businessInfo?.type || '-',
      },
      {
        label: 'Registration Number',
        value: businessInfo?.registration_number || '-',
      },
      {
        label: 'Street Address',
        value: businessInfo?.street_address || '-',
      },
      {
        label: 'Digital Address',
        value: businessInfo?.digital_address || '-',
      },
      {
        label: 'Country',
        value: businessInfo?.country || businessInfo?.country_code || '-',
      },
      {
        label: 'Business Email',
        value: businessInfo?.email || '-',
      },
      {
        label: 'Business Phone',
        value: businessInfo?.phone || '-',
      },
    ];
  }, [vendorDetails]);

  const relationshipInfo = React.useMemo(() => {
    if (!vendorDetails) return [];

    return [
      {
        label: 'Relationship Type',
        value: vendorDetails.relationship_type || '-',
      },
      {
        label: 'Approval Status',
        value: vendorDetails.approval_status || '-',
      },
      {
        label: 'Account Status',
        value: vendorDetails.status || '-',
      },
      {
        label: 'Created By User ID',
        value: vendorDetails.created_by_user_id || '-',
      },
      {
        label: 'Approved By Admin ID',
        value: vendorDetails.approved_by_admin_id || '-',
      },
      {
        label: 'Approved At',
        value: vendorDetails.approved_at ? formatDate(vendorDetails.approved_at) : '-',
      },
      {
        label: 'Rejection Reason',
        value: vendorDetails.rejection_reason || '-',
      },
      {
        label: 'Last Updated',
        value: vendorDetails.updated_at ? formatDate(vendorDetails.updated_at) : '-',
      },
    ];
  }, [vendorDetails]);

  return {
    vendorDetails,
    vendorInfo,
    corporateInfo,
    relationshipInfo,
    isLoadingVendorDetails,
  };
}