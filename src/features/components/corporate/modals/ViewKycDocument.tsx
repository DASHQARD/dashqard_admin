import React from 'react';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';

import { Loader, Modal } from '@/components';

import { usePersistedModalState, usePresignedURL } from '@/hooks';
import { MODALS } from '@/utils/constants';

export const ViewKycDocument = () => {
  const modal = usePersistedModalState<{
    id: string;
    file_url: string;
    verified: boolean;
  }>({
    paramName: MODALS.CORPORATE_MANAGEMENT.CHILDREN.VIEW_KYC_DOCUMENT,
  });

  const { mutateAsync: getPresignedURL } = usePresignedURL();
  const [documentUrl, setDocumentUrl] = React.useState<string | null>(null);
  const [isPending, setIsPending] = React.useState(false);

  React.useEffect(() => {
    const fileUrl = modal.modalData?.file_url;
    console.log('ViewKycDocument useEffect triggered');
    console.log('Modal data:', modal.modalData);
    console.log('File URL from modal:', fileUrl);

    if (!fileUrl) {
      setDocumentUrl(null);
      setIsPending(false);
      return;
    }

    // If it's already a full HTTP URL, use it directly
    if (fileUrl.startsWith('http')) {
      setDocumentUrl(fileUrl);
      setIsPending(false);
      return;
    }

    // Fetch presigned URL
    let cancelled = false;
    setIsPending(true);

    const fetchDocumentUrl = async () => {
      try {
        const response = await getPresignedURL(fileUrl);
        console.log('Presigned URL response:', response);

        // Handle different response structures (string, object with data, object with url)
        const url: string =
          (typeof response === 'string'
            ? response
            : typeof response === 'object' && response
              ? (response as any)?.data ||
                (response as any)?.url ||
                String(response)
              : String(response)) || fileUrl;
        console.log('fetched url', url);

        if (!cancelled) {
          setDocumentUrl(url);
          setIsPending(false);
        }
      } catch (error) {
        console.error(
          `Failed to fetch presigned URL for file ${fileUrl}:`,
          error
        );
        if (!cancelled) {
          setDocumentUrl(null);
          setIsPending(false);
        }
      }
    };

    fetchDocumentUrl();

    return () => {
      cancelled = true;
      setIsPending(false);
    };
  }, [modal.modalData, getPresignedURL]);

  // Get file type from file_url extension
  const fileType = modal.modalData?.file_url
    ? modal.modalData?.file_url.split('.').pop()?.toLowerCase() || ''
    : '';

  // Check if file is an image
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(
    fileType
  );

  // Check if file is a PDF
  const isPdf = fileType === 'pdf';

  return (
    <Modal
      title="View Document"
      isOpen={modal.isModalOpen(
        MODALS.CORPORATE_MANAGEMENT.CHILDREN.VIEW_KYC_DOCUMENT
      )}
      setIsOpen={(isOpen) => {
        if (!isOpen) {
          modal.closeModal();
        }
      }}
      panelClass="!w-[1240px]"
    >
      <section className="max-h-[760px] bg-gray-50 flex flex-col gap-4 p-6 rounded-4xl">
        <div className="border-2 border-dashed border-[#EEEEEE] p-4 w-full overflow-y-auto">
          <div className="bg-white rounded">
            {isPending ? (
              <div className="flex justify-center items-center h-96">
                <Loader />
              </div>
            ) : documentUrl ? (
              isImage ? (
                <div className="flex justify-center items-center p-4">
                  <img
                    src={documentUrl}
                    alt="KYC Document"
                    className="max-w-full max-h-[700px] object-contain"
                  />
                </div>
              ) : isPdf ? (
                <DocViewer
                  documents={[
                    {
                      uri: documentUrl,
                      fileName: 'KYC Document',
                      fileType: 'pdf',
                    },
                  ]}
                  pluginRenderers={DocViewerRenderers}
                  config={{
                    header: {
                      disableFileName: true,
                      disableHeader: false,
                    },
                    pdfVerticalScrollByDefault: true,
                  }}
                  style={{
                    height: '100%',
                  }}
                />
              ) : (
                <DocViewer
                  documents={[
                    {
                      uri: documentUrl,
                      fileName: 'KYC Document',
                      fileType: fileType,
                    },
                  ]}
                  pluginRenderers={DocViewerRenderers}
                  config={{
                    header: {
                      disableFileName: true,
                      disableHeader: false,
                    },
                    pdfVerticalScrollByDefault: true,
                  }}
                  style={{
                    height: '100%',
                  }}
                />
              )
            ) : (
              <div className="flex justify-center items-center h-96 text-gray-400">
                <p>No document available</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </Modal>
  );
};
