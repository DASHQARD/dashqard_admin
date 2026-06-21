import React, { useState } from 'react';
import { useNavigate } from 'react-router';

import {
  Button,
  CustomIcon,
  Loader,
  Profile,
  Tag,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Text,
} from '@/components';
import { usePersistedModalState } from '@/hooks';
import { MODALS } from '@/utils/constants';
import { getStatusVariant } from '@/utils';
import {
  formatProfileFieldValue,
  getProfileFieldValueClassName,
} from '@/utils/helpers/profileField';

import { useVendorDetailsManagementBase } from '@/features/hooks/vendorManagement/useVendorDetailsManagement';
import { vendorPaymentsManagementQueries } from '@/features/hooks/vendorPaymentsManagement';
import {
  ActivateVendor,
  DeactivateVendor,
  ViewVendorKycDocument,
  VendorCatalogCards,
} from '@/features/components/vendors';
import { ManageVendorPaymentPreferences } from '@/features/components/vendorPayments/modals';

export default function VendorDetails() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('vendor');

  const activateModal = usePersistedModalState({
    paramName: MODALS.VENDOR_MANAGEMENT.CHILDREN.ACTIVATE,
  });

  const suspendModal = usePersistedModalState({
    paramName: MODALS.VENDOR_MANAGEMENT.PARAM_NAME,
  });

  const paymentPreferencesModal = usePersistedModalState({
    paramName: MODALS.VENDOR_PAYMENT_MANAGEMENT.PARAM_NAME,
  });

  const documentModal = usePersistedModalState<{
    id: string;
    file_url: string;
    verified: boolean;
  }>({
    paramName: MODALS.VENDOR_MANAGEMENT.CHILDREN.VIEW_KYC_DOCUMENT,
  });

  const {
    vendorDetails,
    vendorInfo,
    corporateInfo,
    relationshipInfo,
    vendorCatalog,
    catalogBranches,
    catalogCards,
    isLoadingVendorDetails,
    isLoadingVendorCatalog,
  } = useVendorDetailsManagementBase();

  const vendorId = vendorDetails?.id ?? vendorDetails?.vendor_id;
  const { useGetVendorPaymentPreferences } = vendorPaymentsManagementQueries();
  const {
    data: paymentPreferencesData,
    isLoading: isLoadingPaymentPreferences,
  } = useGetVendorPaymentPreferences(
    vendorId != null ? String(vendorId) : '',
    !!vendorId && !isLoadingVendorDetails
  );

  const paymentPreferences =
    vendorDetails?.payment_preference ??
    paymentPreferencesData?.data ??
    paymentPreferencesData;
  const hasPaymentPreferences =
    paymentPreferences &&
    typeof paymentPreferences === 'object' &&
    (paymentPreferences as { id?: number; payment_frequency?: string }).id !=
      null;

  const businessDocuments = React.useMemo(() => {
    return vendorDetails?.business_documents || [];
  }, [vendorDetails?.business_documents]);

  const documentGroups = React.useMemo(() => {
    const groups: Record<string, typeof businessDocuments> = {};
    businessDocuments.forEach((doc: (typeof businessDocuments)[0]) => {
      if (!groups[doc.type]) {
        groups[doc.type] = [];
      }
      groups[doc.type].push(doc);
    });
    return groups;
  }, [businessDocuments]);

  const formatDocumentType = (type: string): string => {
    return type
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleViewDocument = (document: (typeof businessDocuments)[0]) => {
    if (!document?.file_url) return;

    const vendorId = vendorDetails?.id || vendorDetails?.vendor_id || '';

    documentModal.openModal(
      MODALS.VENDOR_MANAGEMENT.CHILDREN.VIEW_KYC_DOCUMENT,
      {
        id: String(document.id ?? `${vendorId}:${document.type}`),
        file_url: document.file_url,
        verified:
          vendorDetails?.approval_status === 'approved' ||
          vendorDetails?.status === 'active',
      }
    );
  };

  const logoUrl = documentGroups['logo']?.[0]?.file_url;
  const avatarUrl = vendorDetails?.vendor_avatar;

  const requiredDocumentTypes = [
    'certificate_of_incorporation',
    'business_license',
    'articles_of_incorporation',
    'utility_bill',
  ];

  const paymentDetails = vendorDetails?.payment_details;

  const displayStatus =
    vendorDetails?.approval_status || vendorDetails?.status || 'N/A';

  const showPaymentPreferencesBanner =
    !isLoadingVendorDetails &&
    !!vendorDetails &&
    !isLoadingPaymentPreferences &&
    !hasPaymentPreferences;

  return (
    <>
      <div className="md:py-10 space-y-10">
        {showPaymentPreferencesBanner && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 px-4 sm:px-6">
            <div className="flex items-start gap-3">
              <CustomIcon
                name="InfoSign"
                width={24}
                height={24}
                className="text-amber-600 shrink-0 mt-0.5"
              />
              <div>
                <p className="text-sm font-medium text-amber-900">
                  Payment preference has not been created
                </p>
                <p className="text-sm text-amber-800 mt-0.5">
                  This vendor does not have a payment schedule set. Set payment
                  preferences to define how often they receive payments.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Button
                variant="outline"
                size="medium"
                className="border-amber-500 text-amber-700"
                onClick={() =>
                  paymentPreferencesModal.openModal(
                    MODALS.VENDOR_PAYMENT_MANAGEMENT.CHILDREN
                      .MANAGE_PREFERENCES,
                    {
                      id: vendorDetails?.id ?? vendorDetails?.vendor_id,
                      vendor_id: vendorDetails?.vendor_id ?? vendorDetails?.id,
                      vendor_name:
                        vendorDetails?.vendor_name ||
                        vendorDetails?.business_name ||
                        vendorDetails?.vendor_email,
                    }
                  )
                }
              >
                <CustomIcon name="Settings" width={20} height={20} />
                Set payment preferences
              </Button>
              <Button
                variant="secondary"
                size="medium"
                onClick={() =>
                  activateModal.openModal(
                    MODALS.VENDOR_MANAGEMENT.CHILDREN.ACTIVATE,
                    {
                      vendor_account_id: Number(
                        vendorDetails?.id ?? vendorDetails?.vendor_id ?? 0
                      ),
                      vendor_id: vendorDetails?.vendor_id ?? vendorDetails?.id,
                      vendor_name:
                        vendorDetails?.vendor_name ||
                        vendorDetails?.business_name ||
                        vendorDetails?.vendor_email,
                    }
                  )
                }
              >
                <CustomIcon name="CheckMarkCircle" width={20} height={20} />
                Approve vendor
              </Button>
            </div>
          </div>
        )}

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
                    id: vendorDetails?.id ?? vendorDetails?.vendor_id,
                    vendor_id: vendorDetails?.vendor_id ?? vendorDetails?.id,
                    vendor_name:
                      vendorDetails?.vendor_name ||
                      vendorDetails?.business_name ||
                      vendorDetails?.vendor_email,
                  }
                )
              }
            >
              <CustomIcon name="Settings" width={20} height={20} />
              Payment Preferences
            </Button>
            {vendorDetails?.approval_status === 'approved' ||
            vendorDetails?.status === 'active' ? (
              <Button
                variant="danger"
                size="medium"
                onClick={() =>
                  suspendModal.openModal(
                    MODALS.VENDOR_MANAGEMENT.CHILDREN.DEACTIVATE,
                    {
                      vendor_account_id: Number(
                        vendorDetails?.id ?? vendorDetails?.vendor_id ?? 0
                      ),
                      id: vendorDetails?.id ?? vendorDetails?.vendor_id,
                      vendor_id: vendorDetails?.vendor_id ?? vendorDetails?.id,
                    }
                  )
                }
              >
                <CustomIcon name="InfoSign" width={20} height={20} />
                Reject vendor
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="medium"
                onClick={() =>
                  activateModal.openModal(
                    MODALS.VENDOR_MANAGEMENT.CHILDREN.ACTIVATE,
                    {
                      vendor_account_id: Number(
                        vendorDetails?.id ?? vendorDetails?.vendor_id ?? 0
                      ),
                      vendor_id: vendorDetails?.id ?? vendorDetails?.vendor_id,
                      vendor_name:
                        vendorDetails?.vendor_name ||
                        vendorDetails?.business_name ||
                        vendorDetails?.vendor_email,
                    }
                  )
                }
              >
                <CustomIcon name="CheckMarkCircle" width={20} height={20} />
                Approve Vendor
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
            name={
              vendorDetails?.vendor_name ||
              vendorDetails?.business_name ||
              vendorDetails?.vendor_email ||
              'N/A'
            }
            businessName={vendorDetails?.business_name || 'N/A'}
            status={displayStatus}
            logo={avatarUrl ?? logoUrl}
          >
            <div className="flex flex-col gap-6 w-full min-w-0">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="h-auto w-full max-w-full flex-wrap justify-start gap-1">
                  <TabsTrigger value="vendor">Vendor Information</TabsTrigger>
                  <TabsTrigger value="business">Business Profile</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="payment-details">
                    Payment Details
                  </TabsTrigger>
                  <TabsTrigger value="branches">Branches & Cards</TabsTrigger>
                </TabsList>

                <TabsContent value="vendor" className="mt-6">
                  <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {vendorInfo.map((item) => (
                      <div
                        className="flex flex-col gap-1 min-w-0"
                        key={item.label}
                      >
                        <p className="text-xs text-gray-400">{item.label}</p>
                        <Text
                          variant="span"
                          className={getProfileFieldValueClassName(item.label)}
                        >
                          {formatProfileFieldValue(item.label, item.value)}
                        </Text>
                      </div>
                    ))}
                  </section>
                </TabsContent>

                <TabsContent value="business" className="mt-6">
                  <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {corporateInfo.map((item) => (
                      <div
                        className="flex flex-col gap-1 min-w-0"
                        key={item.label}
                      >
                        <p className="text-xs text-gray-400">{item.label}</p>
                        <Text
                          variant="span"
                          className={getProfileFieldValueClassName(item.label)}
                        >
                          {formatProfileFieldValue(item.label, item.value)}
                        </Text>
                      </div>
                    ))}
                    {relationshipInfo.map((item) => (
                      <div
                        className="flex flex-col gap-1 min-w-0"
                        key={item.label}
                      >
                        <p className="text-xs text-gray-400">{item.label}</p>
                        <Text
                          variant="span"
                          className={getProfileFieldValueClassName(item.label)}
                        >
                          {formatProfileFieldValue(item.label, item.value)}
                        </Text>
                      </div>
                    ))}
                  </section>
                </TabsContent>

                <TabsContent value="documents" className="mt-6">
                  <div className="border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center bg-[#FAFAFA] p-3">
                      <h2 className="text-gray-500 font-medium">
                        Business Documents
                      </h2>
                      <Tag
                        value={
                          displayStatus === 'approved' ||
                          displayStatus === 'active'
                            ? 'Verified'
                            : displayStatus === 'rejected'
                              ? 'Rejected'
                              : 'Pending'
                        }
                        variant={getStatusVariant(displayStatus)}
                      />
                    </div>

                    <div className="space-y-5 p-3">
                      {requiredDocumentTypes.map((docType) => {
                        const documents = documentGroups[docType] || [];
                        const document = documents[0];

                        return (
                          <div
                            key={docType}
                            className="text-sm flex justify-between items-center"
                          >
                            <Text className="capitalize text-sm text-gray-400">
                              {formatDocumentType(docType)}:
                            </Text>

                            <div className="flex items-center gap-2">
                              {document?.file_url ? (
                                <button
                                  onClick={() => handleViewDocument(document)}
                                  className="flex gap-1 items-center hover:opacity-80 transition-opacity text-blue-500"
                                >
                                  <CustomIcon
                                    name="FileText"
                                    width={24}
                                    height={24}
                                  />
                                  <Text className="text-primary-600 text-sm">
                                    View Document
                                  </Text>
                                </button>
                              ) : (
                                <Text className="text-gray-400 text-sm">
                                  No document uploaded
                                </Text>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {businessDocuments.length > 0 &&
                        businessDocuments[0]
                          ?.employer_identification_number && (
                          <div className="text-sm flex justify-between items-center pt-3 border-t border-gray-200">
                            <Text className="capitalize text-sm text-gray-400">
                              Employer Identification Number:
                            </Text>
                            <Text className="text-primary-800">
                              {
                                businessDocuments[0]
                                  .employer_identification_number
                              }
                            </Text>
                          </div>
                        )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="payment-details" className="mt-6">
                  <div className="border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center bg-[#FAFAFA] p-3">
                      <h2 className="text-gray-500 font-medium">
                        Payment Details
                      </h2>
                    </div>

                    <div className="space-y-5 p-3">
                      <div className="text-sm flex justify-between items-center">
                        <Text className="capitalize text-sm text-gray-400">
                          Default Payment Option:
                        </Text>
                        <Text className="text-primary-800 capitalize">
                          {paymentDetails?.default_payment_option
                            ? paymentDetails.default_payment_option.replace(
                                /_/g,
                                ' '
                              )
                            : 'N/A'}
                        </Text>
                      </div>

                      <div className="pt-3 border-t border-gray-200 space-y-3">
                        <Text className="text-sm text-gray-500 font-medium">
                          Mobile Money
                        </Text>
                        <div className="text-sm flex justify-between items-center">
                          <Text className="capitalize text-sm text-gray-400">
                            Provider:
                          </Text>
                          <Text className="text-primary-800 capitalize">
                            {paymentDetails?.momo_account?.provider || 'N/A'}
                          </Text>
                        </div>
                        <div className="text-sm flex justify-between items-center">
                          <Text className="capitalize text-sm text-gray-400">
                            Number:
                          </Text>
                          <Text className="text-primary-800">
                            {paymentDetails?.momo_account?.momo_number || 'N/A'}
                          </Text>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-200 space-y-3">
                        <Text className="text-sm text-gray-500 font-medium">
                          Bank Account
                        </Text>
                        <div className="text-sm flex justify-between items-center">
                          <Text className="capitalize text-sm text-gray-400">
                            Status:
                          </Text>
                          <Text className="text-primary-800">
                            {paymentDetails?.bank_account
                              ? 'Configured'
                              : 'Not configured'}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="branches" className="mt-6 space-y-6">
                  {!vendorDetails?.gvid ? (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <Text className="text-sm text-gray-500">
                        No GVID available for this vendor. Catalog cannot be
                        loaded.
                      </Text>
                    </div>
                  ) : isLoadingVendorCatalog ? (
                    <div className="h-32 flex justify-center items-center">
                      <Loader />
                    </div>
                  ) : (
                    <>
                      {vendorCatalog?.vendor?.qr_code_url && (
                        <div className="border border-gray-200 rounded-lg p-4">
                          <p className="text-xs text-gray-400 mb-1">QR Code URL</p>
                          <a
                            href={vendorCatalog.vendor.qr_code_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-primary-600 break-all hover:underline"
                          >
                            {vendorCatalog.vendor.qr_code_url}
                          </a>
                        </div>
                      )}

                      <div className="border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-center bg-[#FAFAFA] p-3">
                          <h2 className="text-gray-500 font-medium">Branches</h2>
                          <Text className="text-xs text-gray-400">
                            {catalogBranches.length} branch
                            {catalogBranches.length === 1 ? '' : 'es'}
                          </Text>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[760px]">
                            <thead className="border-b border-gray-100">
                              <tr>
                                <th className="text-left p-3 text-xs text-gray-400 font-medium">
                                  Branch Name
                                </th>
                                <th className="text-left p-3 text-xs text-gray-400 font-medium">
                                  Branch Code
                                </th>
                                <th className="text-left p-3 text-xs text-gray-400 font-medium">
                                  Full Branch ID
                                </th>
                                <th className="text-left p-3 text-xs text-gray-400 font-medium">
                                  Location
                                </th>
                                <th className="text-left p-3 text-xs text-gray-400 font-medium">
                                  GVID
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {catalogBranches.map((branch) => (
                                <tr
                                  key={branch.id}
                                  className="border-b border-gray-100 last:border-b-0"
                                >
                                  <td className="p-3 text-sm text-primary-900">
                                    {branch.branch_name}
                                  </td>
                                  <td className="p-3 text-sm text-primary-900">
                                    {branch.branch_code}
                                  </td>
                                  <td className="p-3 text-sm text-primary-900">
                                    {branch.full_branch_id}
                                  </td>
                                  <td className="p-3 text-sm text-primary-900">
                                    {branch.branch_location}
                                  </td>
                                  <td className="p-3 text-sm text-primary-900">
                                    {branch.gvid}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {catalogBranches.length === 0 && (
                            <div className="p-4">
                              <Text className="text-sm text-gray-500">
                                No branches found in catalog.
                              </Text>
                            </div>
                          )}
                        </div>
                      </div>

                      <VendorCatalogCards
                        cards={catalogCards}
                        title="Gift Cards"
                      />
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </Profile>
        )}
      </div>

      {activateModal.modalState ===
        MODALS.VENDOR_MANAGEMENT.CHILDREN.ACTIVATE && <ActivateVendor />}

      <DeactivateVendor />

      {paymentPreferencesModal.modalState ===
        MODALS.VENDOR_PAYMENT_MANAGEMENT.CHILDREN.MANAGE_PREFERENCES && (
        <ManageVendorPaymentPreferences />
      )}

      {documentModal.modalState ===
        MODALS.VENDOR_MANAGEMENT.CHILDREN.VIEW_KYC_DOCUMENT && (
        <ViewVendorKycDocument />
      )}
    </>
  );
}
