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

import { useCorporateManagementBase } from '@/features/hooks/corporateManagement';
import {
  ActivateCorporate,
  SuspendCorporate,
  ViewKycDocument,
} from '@/features/components';

export default function CorporateDetails() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');

  const documentModal = usePersistedModalState<{
    id: string;
    file_url: string;
    verified: boolean;
  }>({
    paramName: MODALS.CORPORATE_MANAGEMENT.CHILDREN.VIEW_KYC_DOCUMENT,
  });

  const activateModal = usePersistedModalState({
    paramName: MODALS.CORPORATE_MANAGEMENT.PARAM_NAME,
  });

  const suspendModal = usePersistedModalState({
    paramName: MODALS.CORPORATE_MANAGEMENT.PARAM_NAME,
  });

  const {
    corporateDetails,
    corporateInfo,
    businessInfo,
    isLoadingCorporateDetails,
  } = useCorporateManagementBase();

  const corporateData = corporateDetails?.data || corporateDetails;

  const corporateId =
    corporateData?.id ??
    corporateData?.corporate_id ??
    corporateDetails?.data?.id ??
    corporateDetails?.id ??
    '';

  // Group documents by type
  const businessDocuments = React.useMemo(() => {
    return corporateData?.business_documents || [];
  }, [corporateData?.business_documents]);

  const idImages = React.useMemo(
    () => corporateData?.id_images || [],
    [corporateData?.id_images]
  );

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

    documentModal.openModal(
      MODALS.CORPORATE_MANAGEMENT.CHILDREN.VIEW_KYC_DOCUMENT,
      {
        id: String(corporateId),
        file_url: document.file_url,
        verified: corporateData?.status === 'approved',
      }
    );
  };

  const handleViewIdImage = (image: (typeof idImages)[0]) => {
    if (!image?.file_url) return;
    documentModal.openModal(
      MODALS.CORPORATE_MANAGEMENT.CHILDREN.VIEW_KYC_DOCUMENT,
      {
        id: String(corporateId),
        file_url: image.file_url,
        verified: corporateData?.status === 'approved',
      }
    );
  };

  const logoUrl = documentGroups['logo']?.[0]?.file_url;

  const requiredDocumentTypes = [
    'certificate_of_incorporation',
    'business_license',
    'articles_of_incorporation',
    'utility_bill',
  ];

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
            {corporateData?.status === 'approved' ? (
              <Button
                variant="danger"
                size="medium"
                className="border-primary-500 text-primary-500"
                onClick={() =>
                  suspendModal.openModal(
                    MODALS.CORPORATE_MANAGEMENT.CHILDREN.DEACTIVATE,
                    { id: corporateId }
                  )
                }
              >
                <CustomIcon name="InfoSign" width={20} height={20} />
                Suspend Corporate
              </Button>
            ) : (
              <Button
                size="medium"
                className="bg-green-500! text-white!"
                onClick={() =>
                  activateModal.openModal(
                    MODALS.CORPORATE_MANAGEMENT.CHILDREN.ACTIVATE,
                    { id: corporateId }
                  )
                }
              >
                Activate Corporate
              </Button>
            )}
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
            name={corporateData?.fullname || 'N/A'}
            businessName={corporateData?.business_name || 'N/A'}
            status={corporateData?.status || 'N/A'}
            logo={logoUrl}
          >
            <div className="flex flex-col gap-6 w-full">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="personal">Personal Profile</TabsTrigger>
                  <TabsTrigger value="business">Business Profile</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="mt-6">
                  <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {corporateInfo.map((item) => (
                      <div
                        className="flex flex-col gap-1 min-w-0"
                        key={item.label}
                      >
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
                        {corporateData?.status || '-'}
                      </Text>
                    </div>
                  </section>
                </TabsContent>

                <TabsContent value="business" className="mt-6">
                  <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {businessInfo.map((item) => (
                      <div
                        className="flex flex-col gap-1 min-w-0"
                        key={item.label}
                      >
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
                </TabsContent>

                <TabsContent value="documents" className="mt-6 space-y-6">
                  {/* ID Images (from new API) */}
                  {idImages.length > 0 && (
                    <div className="border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-center bg-[#FAFAFA] p-3">
                        <h2 className="text-gray-500 font-medium">ID Images</h2>
                      </div>
                      <div className="space-y-3 p-3">
                        {idImages.map(
                          (image: {
                            id: number;
                            file_url: string;
                            file_name?: string;
                          }) => (
                            <div
                              key={image.id}
                              className="text-sm flex justify-between items-center"
                            >
                              <Text className="text-gray-400">
                                {image.file_name || `ID Image ${image.id}`}
                              </Text>
                              <button
                                onClick={() => handleViewIdImage(image)}
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
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  <div className="border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center bg-[#FAFAFA] p-3">
                      <h2 className="text-gray-500 font-medium">
                        Business Documents
                      </h2>
                      <Tag
                        value={
                          corporateData?.status === 'approved'
                            ? 'Verified'
                            : corporateData?.status === 'rejected'
                              ? 'Rejected'
                              : 'Pending'
                        }
                        variant={getStatusVariant(
                          corporateData?.status || 'pending'
                        )}
                      />
                    </div>

                    <div className="space-y-5 p-3">
                      {requiredDocumentTypes.map((docType) => {
                        const documents = documentGroups[docType] || [];
                        const document = documents[0]; // Get first document of this type

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

                      {/* Additional business information if available */}
                      {businessDocuments.length > 0 &&
                        businessDocuments[0]?.business_industry && (
                          <div className="text-sm flex justify-between items-center pt-3 border-t border-gray-200">
                            <Text className="capitalize text-sm text-gray-400">
                              Business Industry:
                            </Text>
                            <Text className="text-primary-800 capitalize">
                              {businessDocuments[0].business_industry}
                            </Text>
                          </div>
                        )}

                      {businessDocuments.length > 0 &&
                        businessDocuments[0]
                          ?.employer_identification_number && (
                          <div className="text-sm flex justify-between items-center">
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
              </Tabs>
            </div>
          </Profile>
        )}
      </div>

      {activateModal.modalState ===
        MODALS.CORPORATE_MANAGEMENT.CHILDREN.ACTIVATE && <ActivateCorporate />}

      {suspendModal.modalState ===
        MODALS.CORPORATE_MANAGEMENT.CHILDREN.DEACTIVATE && <SuspendCorporate />}

      {documentModal.modalState ===
        MODALS.CORPORATE_MANAGEMENT.CHILDREN.VIEW_KYC_DOCUMENT && (
        <ViewKycDocument />
      )}
    </>
  );
}
