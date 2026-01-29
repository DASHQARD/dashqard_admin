import React from 'react';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';

import { Loader, Modal } from '@/components';

import { usePersistedModalState, usePresignedURL } from '@/hooks';
import { MODALS } from '@/utils/constants';

export const ViewVendorKycDocument = () => {
  const modal = usePersistedModalState<{
    id: string;
    file_url: string;
    verified: boolean;
  }>({
    paramName: MODALS.VENDOR_MANAGEMENT.CHILDREN.VIEW_KYC_DOCUMENT,
  });

  const { mutateAsync: getPresignedURL } = usePresignedURL();
  const [documentUrl, setDocumentUrl] = React.useState<string | null>(null);
  const [isPending, setIsPending] = React.useState(false);

  React.useEffect(() => {
    const fileUrl = modal.modalData?.file_url;

    if (!fileUrl) {
      setDocumentUrl(null);
      setIsPending(false);
      return;
    }

    if (fileUrl.startsWith('http')) {
      setDocumentUrl(fileUrl);
      setIsPending(false);
      return;
    }

    let cancelled = false;
    setIsPending(true);

    const fetchDocumentUrl = async () => {
      try {
        const response = await getPresignedURL(fileUrl);
        const url: string =
          (typeof response === 'string'
            ? response
            : typeof response === 'object' && response
              ? (response as any)?.data ||
                (response as any)?.url ||
                String(response)
              : String(response)) || fileUrl;

        if (!cancelled) {
          setDocumentUrl(url);
          setIsPending(false);
        }
      } catch (error) {
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

  const fileType = modal.modalData?.file_url
    ? modal.modalData?.file_url.split('.').pop()?.toLowerCase() || ''
    : '';

  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(
    fileType
  );

  const isPdf = fileType === 'pdf';

  return (
    <Modal
      title="View Document"
      isOpen={modal.isModalOpen(
        MODALS.VENDOR_MANAGEMENT.CHILDREN.VIEW_KYC_DOCUMENT
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
                    alt="Vendor Document"
                    className="max-w-full max-h-[700px] object-contain"
                  />
                </div>
              ) : isPdf ? (
                <DocViewer
                  documents={[
                    {
                      uri: documentUrl,
                      fileName: 'Vendor Document',
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
                      fileName: 'Vendor Document',
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
