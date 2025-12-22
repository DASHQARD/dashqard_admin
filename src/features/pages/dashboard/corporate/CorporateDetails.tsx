import { useNavigate } from 'react-router';

import {
  // Badge,
  Button,
  CustomIcon,
  Loader,
  Profile,
  // Tag,
  // TabbedView,
  Text,
} from '@/components';
import { usePersistedModalState } from '@/hooks';
import { MODALS } from '@/utils/constants';

import { useCorporateManagementBase } from '@/features/hooks/corporateManagement';
import {
  ActivateCorporate,
  SuspendCorporate,
  ViewBusinessInformation,
  ViewKYC,
  ViewKycDocument,
} from '@/features/components';

export default function CorporateDetails() {
  const navigate = useNavigate();

  const kycModal = usePersistedModalState({
    paramName: MODALS.CORPORATE_MANAGEMENT.CHILDREN.KYC,
  });

  const businessInfoModal = usePersistedModalState({
    paramName: MODALS.CORPORATE_MANAGEMENT.CHILDREN.VIEW_BUSINESS_INFORMATION,
  });

  const activateModal = usePersistedModalState({
    paramName: MODALS.CORPORATE_MANAGEMENT.CHILDREN.ACTIVATE,
  });

  const suspendModal = usePersistedModalState({
    paramName: MODALS.CORPORATE_MANAGEMENT.CHILDREN.DEACTIVATE,
  });

  const {
    corporateDetails,
    corporateInfo,
    businessInfo,
    isLoadingCorporateDetails,
  } = useCorporateManagementBase();

  return (
    <>
      <div className="md:py-10 space-y-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-gray-500 text-xs cursor-pointer"
            >
              <CustomIcon
                name="ArrowTurnBackward"
                className="-rotate-x-180"
                width={20}
                height={20}
              />
              Back to Corporate management
            </button>
            <h2 className="text-2xl font-semibold text-primary-900 mt-2">
              Corporate Profile
            </h2>
          </div>
          <div className="flex gap-4 items-center">
            {corporateDetails?.data?.status === 'approved' ||
            corporateDetails?.status === 'approved' ? (
              <Button
                variant="outline"
                size="medium"
                className="border-primary-500 text-primary-500"
                onClick={() =>
                  suspendModal.openModal(
                    MODALS.CORPORATE_MANAGEMENT.CHILDREN.DEACTIVATE,
                    {
                      id:
                        corporateDetails?.data?.id ||
                        corporateDetails?.data?.corporate_id ||
                        corporateDetails?.id ||
                        '',
                    }
                  )
                }
              >
                <CustomIcon name="InfoSign" width={20} height={20} />
                Suspend Corporate
              </Button>
            ) : (
              <Button
                variant="outline"
                size="medium"
                className="border-primary-500 text-primary-500"
                onClick={() =>
                  activateModal.openModal(
                    MODALS.CORPORATE_MANAGEMENT.CHILDREN.ACTIVATE,
                    {
                      id:
                        corporateDetails?.data?.id ||
                        corporateDetails?.data?.corporate_id ||
                        corporateDetails?.id ||
                        '',
                    }
                  )
                }
              >
                <CustomIcon name="CheckMarkCircle" width={20} height={20} />
                Activate Corporate
              </Button>
            )}
            <Button
              onClick={() =>
                kycModal.openModal(
                  MODALS.CORPORATE_MANAGEMENT.CHILDREN.KYC,
                  corporateDetails
                )
              }
              size={'medium'}
              variant={'outline'}
              className="border-primary-500 text-primary-500"
            >
              View KYC
            </Button>
          </div>
        </div>

        {isLoadingCorporateDetails ? (
          <div className="h-40 flex justify-center items-center">
            <div>
              <Loader />
            </div>
          </div>
        ) : (
          <Profile
            name={corporateDetails?.fullname || 'N/A'}
            businessName={corporateDetails?.business_name || 'N/A'}
            status={corporateDetails?.status || 'N/A'}
          >
            <div className="flex flex-col gap-6 w-full">
              <div className="flex justify-between items-center">
                <Text variant="h5" weight="medium">
                  Personal Information
                </Text>
                <Button
                  onClick={() =>
                    businessInfoModal.openModal(
                      MODALS.CORPORATE_MANAGEMENT.CHILDREN
                        .VIEW_BUSINESS_INFORMATION,
                      corporateDetails
                    )
                  }
                  variant="outline"
                  size="medium"
                >
                  View business information
                </Button>
              </div>

              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {corporateInfo.map((item) => (
                  <div className="flex flex-col gap-1 min-w-0" key={item.label}>
                    <p className="text-xs text-gray-400 whitespace-nowrap">
                      {item.label}
                    </p>
                    <Text
                      variant="span"
                      className="wrap-break-word overflow-hidden"
                    >
                      {item.value}
                    </Text>
                  </div>
                ))}
                <div className="flex flex-col gap-1 min-w-0">
                  <p className="text-xs text-gray-400 whitespace-nowrap">
                    Status
                  </p>
                  <Text variant="span" className="capitalize">
                    {corporateDetails?.status || '-'}
                  </Text>
                </div>
              </section>

              <Text variant="h5" weight="medium" className="mt-6">
                Business Information
              </Text>
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {businessInfo.map((item) => (
                  <div className="flex flex-col gap-1 min-w-0" key={item.label}>
                    <p className="text-xs text-gray-400 whitespace-nowrap">
                      {item.label}
                    </p>
                    <Text
                      variant="span"
                      className="wrap-break-word overflow-hidden"
                    >
                      {item.value}
                    </Text>
                  </div>
                ))}
              </section>
            </div>
          </Profile>
        )}
      </div>

      {kycModal.modalState === MODALS.CORPORATE_MANAGEMENT.CHILDREN.KYC && (
        <ViewKYC corporate={corporateDetails} />
      )}
      {activateModal.modalState ===
        MODALS.CORPORATE_MANAGEMENT.CHILDREN.ACTIVATE && <ActivateCorporate />}

      {suspendModal.modalState ===
        MODALS.CORPORATE_MANAGEMENT.CHILDREN.DEACTIVATE && <SuspendCorporate />}

      {kycModal.modalState ===
        MODALS.CORPORATE_MANAGEMENT.CHILDREN.VIEW_KYC_DOCUMENT && (
        <ViewKycDocument />
      )}

      {businessInfoModal.modalState ===
        MODALS.CORPORATE_MANAGEMENT.CHILDREN.VIEW_BUSINESS_INFORMATION && (
        <ViewBusinessInformation />
      )}
    </>
  );
}
