import React from 'react';

import { Avatar, CustomIcon, Modal, Tag, Text } from '@/components';
import { usePersistedModalState, usePresignedURL } from '@/hooks';
import { getStatusVariant, MODALS } from '@/utils';
import { ViewKycDocument } from './ViewKycDocument';

type CorporateData = {
  data?: {
    id: number;
    fullname: string;
    business_name: string;
    status: string;
    onboarding_stage: string;
    business_documents?: Array<{
      id: number;
      type: string;
      file_url: string;
      file_name: string;
      business_industry?: string;
      employer_identification_number?: string;
      created_at: string;
      updated_at: string;
    }>;
  };
  fullname?: string;
  business_name?: string;
  status?: string;
  id?: number;
  business_documents?: Array<{
    id: number;
    type: string;
    file_url: string;
    file_name: string;
    business_industry?: string;
    employer_identification_number?: string;
    created_at: string;
    updated_at: string;
  }>;
};

type Props = {
  corporate?: CorporateData | null;
  noProfile?: boolean;
};

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  certificate_of_incorporation: 'Certificate of Incorporation',
  business_license: 'Business License',
  articles_of_incorporation: 'Articles of Incorporation',
  utility_bill: 'Utility Bill',
  logo: 'Logo',
};

const getStatusText = (status?: string): string => {
  if (!status) return 'N/A';
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const ViewKYC = ({ corporate, noProfile }: Props) => {
  const modal = usePersistedModalState<CorporateData>({
    paramName: MODALS.CORPORATE_MANAGEMENT.CHILDREN.KYC,
  });

  const documentModal = usePersistedModalState<{
    id: string;
    file_url: string;
    verified: boolean;
  }>({
    paramName: MODALS.CORPORATE_MANAGEMENT.CHILDREN.VIEW_KYC_DOCUMENT,
  });

  const { mutateAsync: getPresignedURL } = usePresignedURL();

  // Use prop if provided, otherwise use modal data
  const corporateData =
    corporate?.data || corporate || modal.modalData?.data || modal.modalData;

  const businessDocuments = React.useMemo(() => {
    return corporateData?.business_documents || [];
  }, [corporateData?.business_documents]);

  // Group documents by type for better organization
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

  // State to store presigned logo URL
  const [logoPresignedUrl, setLogoPresignedUrl] = React.useState<
    string | undefined
  >(undefined);

  // Fetch presigned URL only for the logo document
  React.useEffect(() => {
    const logoDoc = documentGroups['logo']?.[0];
    if (!logoDoc?.file_url || logoDoc.file_url.startsWith('http')) {
      setLogoPresignedUrl(logoDoc?.file_url);
      return;
    }

    let cancelled = false;

    const fetchLogoPresignedUrl = async () => {
      try {
        const response = await getPresignedURL(logoDoc.file_url);
        const url =
          response?.data || response?.url || response || logoDoc.file_url;
        if (!cancelled) {
          setLogoPresignedUrl(url);
        }
      } catch (error) {
        console.error(
          `Failed to fetch presigned URL for logo ${logoDoc.file_url}:`,
          error
        );
        if (!cancelled) {
          setLogoPresignedUrl(logoDoc.file_url);
        }
      }
    };

    fetchLogoPresignedUrl();

    return () => {
      cancelled = true;
    };
  }, [documentGroups, getPresignedURL]);

  if (!corporateData) {
    return null;
  }

  const fullname = corporateData.fullname || 'N/A';
  const businessName = corporateData.business_name || 'N/A';
  const status = corporateData.status || 'pending';
  const corporateId = corporateData.id;

  const formatDocumentType = (type: string): string => {
    return (
      DOCUMENT_TYPE_LABELS[type] ||
      type
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    );
  };

  const handleViewDocument = (document: (typeof businessDocuments)[0]) => {
    console.log('document', document);
    if (!document?.file_url) return;

    // Open the ViewKycDocument modal with the document data
    documentModal.openModal(
      MODALS.CORPORATE_MANAGEMENT.CHILDREN.VIEW_KYC_DOCUMENT,
      {
        id: String(corporateId),
        file_url: document.file_url,
        verified: status === 'approved',
      }
    );
  };

  // Required document types (excluding logo as it's shown in profile)
  const requiredDocumentTypes = [
    'certificate_of_incorporation',
    'business_license',
    'articles_of_incorporation',
    'utility_bill',
  ];

  return (
    <Modal
      position="side"
      title="Corporate KYC"
      isOpen={modal.isModalOpen(MODALS.CORPORATE_MANAGEMENT.CHILDREN.KYC)}
      setIsOpen={(isOpen) => {
        if (!isOpen) {
          modal.closeModal();
        }
      }}
      panelClass="!w-[621px]"
    >
      <div className="px-6">
        {!noProfile && (
          <div className="flex flex-col items-center justify-center gap-4 pb-6">
            <Avatar
              size="lg"
              name={fullname}
              src={logoPresignedUrl}
              className="rounded-lg flex justify-center items-center h-[90px] w-[90px]"
            />
            <div className="space-y-1 flex flex-col items-center">
              <p className="font-medium">{fullname}</p>
              <div className="flex gap-2 items-center">
                <Text className="text-gray-600 text-sm">{businessName}</Text>
                <Tag
                  value={getStatusText(status)}
                  variant={getStatusVariant(status)}
                />
              </div>
              <Text className="text-gray-500 text-xs capitalize">
                Onboarding Stage: {corporateData.onboarding_stage || 'N/A'}
              </Text>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center bg-[#FAFAFA] p-3">
              <h2 className="text-gray-500 font-medium">Business Documents</h2>
              <Tag
                value={
                  status === 'approved'
                    ? 'Verified'
                    : status === 'rejected'
                      ? 'Rejected'
                      : 'Pending'
                }
                variant={getStatusVariant(status)}
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
                          <CustomIcon name="FileText" width={24} height={24} />
                          <Text className="text-primary-600 text-sm">
                            {document.file_url || 'View Document'}
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
                businessDocuments[0]?.employer_identification_number && (
                  <div className="text-sm flex justify-between items-center">
                    <Text className="capitalize text-sm text-gray-400">
                      Employer Identification Number:
                    </Text>
                    <Text className="text-primary-800">
                      {businessDocuments[0].employer_identification_number}
                    </Text>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>

      {documentModal.modalState ===
        MODALS.CORPORATE_MANAGEMENT.CHILDREN.VIEW_KYC_DOCUMENT && (
        <ViewKycDocument />
      )}
    </Modal>
  );
};
