import React from 'react';
import { Button, Modal, Tag, Text } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { MODALS, getStatusVariant } from '@/utils';
import { formatDate } from '@/utils/helpers/common';

type VendorData = {
  id?: number;
  vendor_id?: number;
  vendor_name?: string;
  vendor_email?: string;
  vendor_phone?: string;
  vendor_avatar?: string | null;
  vendor_user_type?: string;
  vendor_status?: string;
  corporate_name?: string;
  corporate_email?: string;
  business_name?: string;
  gvid?: string;
  relationship_type?: string;
  approval_status?: string;
  status?: string;
  approved_by_admin_id?: number | null;
  approved_at?: string | null;
  rejection_reason?: string | null;
  onboarding_stage?: string;
  onboarding_completed?: boolean;
  branch_count?: string;
  created_at?: string;
  updated_at?: string;
  data_references?: Array<{
    id: number;
    data_type: string;
    approval_status: string;
    requires_approval: boolean;
    is_copied_from_corporate: boolean;
  }>;
};

export function ViewVendorDetails() {
  const modal = usePersistedModalState<VendorData>({
    paramName: MODALS.VENDOR_MANAGEMENT.PARAM_NAME,
  });

  const vendorData = modal.modalData;

  // Transform vendor data into vendor_info structure
  const vendorInfo = React.useMemo(() => {
    if (!vendorData) return {};
    return {
      vendor_name: vendorData.vendor_name || '-',
      vendor_email: vendorData.vendor_email || '-',
      vendor_phone: vendorData.vendor_phone || '-',
      vendor_user_type: vendorData.vendor_user_type || '-',
      vendor_status: vendorData.vendor_status || '-',
      gvid: vendorData.gvid || '-',
    };
  }, [vendorData]);

  // Transform vendor data into corporate_info structure
  const corporateInfo = React.useMemo(() => {
    if (!vendorData) return {};
    return {
      corporate_name: vendorData.corporate_name || '-',
      corporate_email: vendorData.corporate_email || '-',
    };
  }, [vendorData]);

  // Transform vendor data into business_info structure
  const businessInfo = React.useMemo(() => {
    if (!vendorData) return {};
    return {
      business_name: vendorData.business_name || '-',
    };
  }, [vendorData]);

  // Transform vendor data into relationship_info structure
  const relationshipInfo = React.useMemo(() => {
    if (!vendorData) return {};
    return {
      relationship_type: vendorData.relationship_type || '-',
      approval_status: vendorData.approval_status || '-',
      status: vendorData.status || '-',
      approved_at: vendorData.approved_at
        ? formatDate(vendorData.approved_at)
        : '-',
      rejection_reason: vendorData.rejection_reason || '-',
    };
  }, [vendorData]);

  // Transform vendor data into onboarding_info structure
  const onboardingInfo = React.useMemo(() => {
    if (!vendorData) return {};
    return {
      onboarding_stage: vendorData.onboarding_stage || '-',
      onboarding_completed: vendorData.onboarding_completed ? 'Yes' : 'No',
      branch_count: vendorData.branch_count || '0',
    };
  }, [vendorData]);

  const dataReferences = React.useMemo(() => {
    return vendorData?.data_references || [];
  }, [vendorData]);

  if (!vendorData) {
    return null;
  }

  return (
    <Modal
      panelClass="!w-[680px] min-w-full"
      title="Vendor Details"
      isOpen={modal.isModalOpen(MODALS.VENDOR_MANAGEMENT.CHILDREN.VIEW)}
      setIsOpen={(isOpen) => {
        if (!isOpen) {
          modal.closeModal();
        }
      }}
      position="side"
    >
      <div className="h-full px-6 flex flex-col gap-6 justify-between">
        <div className="grow overflow-y-auto">
          {/* Vendor Information */}
          <div className="space-y-4">
            <Text
              variant="p"
              weight="medium"
              className="text-sm text-primary-900"
            >
              Vendor Information
            </Text>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(vendorInfo).map(([key, value]) => {
                if (key === 'vendor_status')
                  return (
                    <div key={key} className="space-y-1">
                      <Text
                        variant="p"
                        className="text-gray-400 text-xs capitalize"
                      >
                        {key.split('_').slice(1).join(' ') || key}
                      </Text>
                      <Tag
                        value={String(value)}
                        variant={getStatusVariant(String(value))}
                        className="w-fit"
                      />
                    </div>
                  );
                return (
                  <div key={key} className="space-y-1">
                    <Text
                      variant="p"
                      className="text-gray-400 text-xs capitalize"
                    >
                      {key.split('_').slice(1).join(' ') || key}
                    </Text>
                    <Text variant="p" className="text-sm text-gray-800">
                      {String(value)}
                    </Text>
                  </div>
                );
              })}
            </div>
          </div>

          <hr className="my-6 border-gray-200" />

          {/* Corporate Information */}
          <div className="space-y-4">
            <Text
              variant="p"
              weight="medium"
              className="text-sm text-primary-900"
            >
              Corporate Information
            </Text>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(corporateInfo).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <Text
                    variant="p"
                    className="text-gray-400 text-xs capitalize"
                  >
                    {key.split('_').slice(1).join(' ') || key}
                  </Text>
                  <Text variant="p" className="text-sm text-gray-800">
                    {String(value)}
                  </Text>
                </div>
              ))}
            </div>
          </div>

          <hr className="my-6 border-gray-200" />

          {/* Business Information */}
          <div className="space-y-4">
            <Text
              variant="p"
              weight="medium"
              className="text-sm text-primary-900"
            >
              Business Information
            </Text>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(businessInfo).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <Text
                    variant="p"
                    className="text-gray-400 text-xs capitalize"
                  >
                    {key.split('_').join(' ') || key}
                  </Text>
                  <Text variant="p" className="text-sm text-gray-800">
                    {String(value)}
                  </Text>
                </div>
              ))}
            </div>
          </div>

          <hr className="my-6 border-gray-200" />

          {/* Relationship Information */}
          <div className="space-y-4">
            <Text
              variant="p"
              weight="medium"
              className="text-sm text-primary-900"
            >
              Relationship Information
            </Text>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(relationshipInfo).map(([key, value]) => {
                if (key === 'status' || key === 'approval_status')
                  return (
                    <div key={key} className="space-y-1">
                      <Text
                        variant="p"
                        className="text-gray-400 text-xs capitalize"
                      >
                        {key.split('_').join(' ') || '-'}
                      </Text>
                      <Tag
                        value={String(value)}
                        variant={getStatusVariant(String(value))}
                        className="w-fit"
                      />
                    </div>
                  );
                if (key === 'rejection_reason' && value === '-') {
                  return null;
                }
                return (
                  <div key={key} className="space-y-1">
                    <Text
                      variant="p"
                      className="text-gray-400 text-xs capitalize"
                    >
                      {key.split('_').join(' ') || '-'}
                    </Text>
                    <Text variant="p" className="text-sm text-gray-800">
                      {String(value)}
                    </Text>
                  </div>
                );
              })}
            </div>
          </div>

          <hr className="my-6 border-gray-200" />

          {/* Onboarding Information */}
          <div className="space-y-4">
            <Text
              variant="p"
              weight="medium"
              className="text-sm text-primary-900"
            >
              Onboarding Information
            </Text>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(onboardingInfo).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <Text
                    variant="p"
                    className="text-gray-400 text-xs capitalize"
                  >
                    {key.split('_').join(' ') || '-'}
                  </Text>
                  <Text variant="p" className="text-sm text-gray-800">
                    {String(value)}
                  </Text>
                </div>
              ))}
            </div>
          </div>

          {/* Data References */}
          {dataReferences.length > 0 && (
            <>
              <hr className="my-6 border-gray-200" />
              <div className="space-y-4">
                <Text
                  variant="p"
                  weight="medium"
                  className="text-sm text-primary-900"
                >
                  Data References
                </Text>
                <div className="space-y-4">
                  {dataReferences.map((reference, index) => (
                    <div key={reference.id} className="space-y-2">
                      <Text
                        variant="p"
                        className="text-gray-500 uppercase text-xs font-medium"
                      >
                        Reference {index + 1}
                      </Text>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Text
                            variant="p"
                            className="text-gray-400 text-xs capitalize"
                          >
                            Data Type
                          </Text>
                          <Text variant="p" className="text-sm text-gray-800">
                            {reference.data_type.split('_').join(' ') || '-'}
                          </Text>
                        </div>
                        <div className="space-y-1">
                          <Text
                            variant="p"
                            className="text-gray-400 text-xs capitalize"
                          >
                            Approval Status
                          </Text>
                          <Tag
                            value={reference.approval_status
                              .split('_')
                              .join(' ')}
                            variant={getStatusVariant(reference.approval_status)}
                            className="w-fit"
                          />
                        </div>
                        <div className="space-y-1">
                          <Text
                            variant="p"
                            className="text-gray-400 text-xs capitalize"
                          >
                            Requires Approval
                          </Text>
                          <Text variant="p" className="text-sm text-gray-800">
                            {reference.requires_approval ? 'Yes' : 'No'}
                          </Text>
                        </div>
                        <div className="space-y-1">
                          <Text
                            variant="p"
                            className="text-gray-400 text-xs capitalize"
                          >
                            Copied From Corporate
                          </Text>
                          <Text variant="p" className="text-sm text-gray-800">
                            {reference.is_copied_from_corporate ? 'Yes' : 'No'}
                          </Text>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Timestamps */}
          <hr className="my-6 border-gray-200" />
          <div className="space-y-4">
            <Text
              variant="p"
              weight="medium"
              className="text-sm text-primary-900"
            >
              Timestamps
            </Text>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Text
                  variant="p"
                  className="text-gray-400 text-xs capitalize"
                >
                  Created At
                </Text>
                <Text variant="p" className="text-sm text-gray-800">
                  {vendorData.created_at
                    ? formatDate(vendorData.created_at, 'DD MMM YYYY, HH:mm')
                    : '-'}
                </Text>
              </div>
              <div className="space-y-1">
                <Text
                  variant="p"
                  className="text-gray-400 text-xs capitalize"
                >
                  Updated At
                </Text>
                <Text variant="p" className="text-sm text-gray-800">
                  {vendorData.updated_at
                    ? formatDate(vendorData.updated_at, 'DD MMM YYYY, HH:mm')
                    : '-'}
                </Text>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Button variant={'outline'} onClick={modal.closeModal}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}


