import React from 'react';
import { Button, Modal, Tag, Text } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { MODALS, getStatusVariant } from '@/utils';
import { formatDate } from '@/utils/helpers/common';

type CorporateData = {
  id?: number;
  fullname?: string;
  email?: string;
  phonenumber?: string;
  status?: string;
  onboarding_stage?: string;
  created_at?: string;
  business_name?: string;
  business_type?: string;
  business_phone?: string;
  business_email?: string;
  business_address?: string;
  business_digital_address?: string;
  registration_number?: string;
  guarantors?: Array<{ name: string; contact: string }>;
};

export function ViewBusinessInformation() {
  const modal = usePersistedModalState<CorporateData>({
    paramName: MODALS.CORPORATE_MANAGEMENT.CHILDREN.VIEW_BUSINESS_INFORMATION,
  });

  const corporateData = modal.modalData;

  // Transform corporate data into basic_info structure
  const basicInfo = React.useMemo(() => {
    if (!corporateData) return {};
    return {
      fullname: corporateData.fullname || '-',
      email: corporateData.email || '-',
      phone: corporateData.phonenumber || '-',
      status: corporateData.status || '-',
      onboarding_stage: corporateData.onboarding_stage || '-',
      created_at: corporateData.created_at
        ? formatDate(corporateData.created_at)
        : '-',
    };
  }, [corporateData]);

  // Transform corporate data into business_location structure
  const businessLocation = React.useMemo(() => {
    if (!corporateData) return {};
    return {
      business_name: corporateData.business_name || '-',
      business_type: corporateData.business_type || '-',
      business_phone: corporateData.business_phone || '-',
      business_email: corporateData.business_email || '-',
      business_address: corporateData.business_address || '-',
      digital_address: corporateData.business_digital_address || '-',
      registration_number: corporateData.registration_number || '-',
    };
  }, [corporateData]);

  const guarantors = React.useMemo(() => {
    return corporateData?.guarantors || [];
  }, [corporateData]);

  if (!corporateData) {
    return null;
  }

  return (
    <Modal
      panelClass="!w-[680px] min-w-full"
      title="Business information"
      isOpen={modal.isModalOpen(
        MODALS.CORPORATE_MANAGEMENT.CHILDREN.VIEW_BUSINESS_INFORMATION
      )}
      setIsOpen={(isOpen) => {
        if (!isOpen) {
          modal.closeModal();
        }
      }}
      position="side"
    >
      <div className="h-full px-6 flex flex-col gap-6 justify-between">
        <div className="grow">
          <div className="space-y-4">
            <Text
              variant="p"
              weight="medium"
              className="text-sm text-primary-900"
            >
              Basic Information
            </Text>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(basicInfo).map(([key, value]) => {
                if (key === 'status')
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
          <div className="space-y-4">
            <Text
              variant="p"
              weight="medium"
              className="text-sm text-primary-900"
            >
              Business location
            </Text>

            <div className="grid gap-4">
              {Object.entries(businessLocation).map(([key, value]) => (
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

          <hr className="my-6 border-gray-200" />
          <div className="space-y-4">
            <Text
              variant="p"
              weight="medium"
              className="text-sm text-primary-900"
            >
              Guarantor(s) details
            </Text>

            {guarantors.length > 0 ? (
              <div className="space-y-6">
                {guarantors.map(
                  (
                    guarantor: { name: string; contact: string },
                    index: number
                  ) => (
                    <div key={index} className="space-y-4">
                      <Text
                        variant="p"
                        className="text-gray-500 uppercase text-xs font-medium"
                      >
                        Guarantor {index + 1}
                      </Text>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Text
                            variant="p"
                            className="text-gray-400 text-xs capitalize"
                          >
                            Full name
                          </Text>
                          <Text variant="p" className="text-sm text-gray-800">
                            {guarantor.name || '-'}
                          </Text>
                        </div>

                        <div className="space-y-1">
                          <Text
                            variant="p"
                            className="text-gray-400 text-xs capitalize"
                          >
                            Contact
                          </Text>
                          <Text variant="p" className="text-sm text-gray-800">
                            {guarantor.contact || '-'}
                          </Text>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <Text variant="p" className="text-sm text-gray-400">
                No guarantors available
              </Text>
            )}
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
