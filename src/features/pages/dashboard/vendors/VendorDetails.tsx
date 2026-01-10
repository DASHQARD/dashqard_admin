import { useNavigate } from 'react-router';

import { Button, CustomIcon, Loader, Profile, Text } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { MODALS } from '@/utils/constants';

import { useVendorDetailsManagementBase } from '@/features/hooks/vendorManagement/useVendorDetailsManagement';
import {
  ActivateVendor,
  SuspendVendor,
} from '@/features/components/vendors/modals';
import { ManageVendorPaymentPreferences } from '@/features/components/vendorPayments/modals';

export default function VendorDetails() {
  const navigate = useNavigate();

  const activateModal = usePersistedModalState({
    paramName: MODALS.VENDOR_MANAGEMENT.CHILDREN.ACTIVATE,
  });

  const suspendModal = usePersistedModalState({
    paramName: MODALS.VENDOR_MANAGEMENT.CHILDREN.DEACTIVATE,
  });

  const paymentPreferencesModal = usePersistedModalState({
    paramName: MODALS.VENDOR_PAYMENT_MANAGEMENT.PARAM_NAME,
  });

  const {
    vendorDetails,
    vendorInfo,
    corporateInfo,
    relationshipInfo,
    isLoadingVendorDetails,
  } = useVendorDetailsManagementBase();

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
              Back to Vendor management
            </button>
            <h2 className="text-2xl font-semibold text-primary-900 mt-2">
              Vendor Profile
            </h2>
          </div>
          <div className="flex gap-4 items-center">
            <Button
              variant="outline"
              size="medium"
              className="border-primary-500 text-primary-500"
              onClick={() =>
                paymentPreferencesModal.openModal(
                  MODALS.VENDOR_PAYMENT_MANAGEMENT.CHILDREN.MANAGE_PREFERENCES,
                  {
                    id: vendorDetails?.id || vendorDetails?.vendor_id,
                    vendor_id: vendorDetails?.vendor_id || vendorDetails?.id,
                    vendor_name: vendorDetails?.vendor_name,
                  }
                )
              }
            >
              <CustomIcon name="Settings" width={20} height={20} />
              Payment Preferences
            </Button>
            {vendorDetails?.status === 'active' ||
            vendorDetails?.approval_status === 'approved' ? (
              <Button
                variant="danger"
                size="medium"
                className="border-primary-500 text-primary-500"
                onClick={() =>
                  suspendModal.openModal(
                    MODALS.VENDOR_MANAGEMENT.CHILDREN.DEACTIVATE,
                    {
                      vendor_account_id:
                        vendorDetails?.id || vendorDetails?.vendor_id || 0,
                    }
                  )
                }
              >
                <CustomIcon name="InfoSign" width={20} height={20} />
                Suspend Vendor
              </Button>
            ) : (
              <Button
                variant="outline"
                size="medium"
                className="border-primary-500 text-primary-500"
                onClick={() =>
                  activateModal.openModal(
                    MODALS.VENDOR_MANAGEMENT.CHILDREN.ACTIVATE,
                    {
                      vendor_account_id:
                        vendorDetails?.id || vendorDetails?.vendor_id || 0,
                    }
                  )
                }
              >
                <CustomIcon name="CheckMarkCircle" width={20} height={20} />
                Activate Vendor
              </Button>
            )}
          </div>
        </div>

        {isLoadingVendorDetails ? (
          <div className="h-40 flex justify-center items-center">
            <div>
              <Loader />
            </div>
          </div>
        ) : (
          <Profile
            name={vendorDetails?.vendor_name || 'N/A'}
            businessName={vendorDetails?.business_name || 'N/A'}
            status={
              vendorDetails?.status || vendorDetails?.approval_status || 'N/A'
            }
          >
            <div className="flex flex-col gap-6 w-full">
              <Text variant="h5" weight="medium">
                Vendor Information
              </Text>
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {vendorInfo.map((item) => (
                  <div className="flex flex-col gap-1 min-w-0" key={item.label}>
                    <p className="text-xs text-gray-400 whitespace-nowrap">
                      {item.label}
                    </p>
                    <Text
                      variant="span"
                      className="wrap-break-word overflow-hidden capitalize"
                    >
                      {item.value}
                    </Text>
                  </div>
                ))}
              </section>

              <Text variant="h5" weight="medium" className="mt-6">
                Corporate Information
              </Text>
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
              </section>

              <Text variant="h5" weight="medium" className="mt-6">
                Relationship Information
              </Text>
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {relationshipInfo.map((item) => (
                  <div className="flex flex-col gap-1 min-w-0" key={item.label}>
                    <p className="text-xs text-gray-400 whitespace-nowrap">
                      {item.label}
                    </p>
                    <Text
                      variant="span"
                      className="wrap-break-word overflow-hidden capitalize"
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

      {activateModal.modalState ===
        MODALS.VENDOR_MANAGEMENT.CHILDREN.ACTIVATE && <ActivateVendor />}

      {suspendModal.modalState ===
        MODALS.VENDOR_MANAGEMENT.CHILDREN.DEACTIVATE && <SuspendVendor />}

      {paymentPreferencesModal.modalState ===
        MODALS.VENDOR_PAYMENT_MANAGEMENT.CHILDREN.MANAGE_PREFERENCES && (
        <ManageVendorPaymentPreferences />
      )}
    </>
  );
}
