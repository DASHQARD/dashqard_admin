import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';

import { Modal } from '@/components';

import { usePersistedModalState } from '@/hooks';
import { MODALS } from '@/utils/constants';

export const ViewKycDocument = () => {
  const modal = usePersistedModalState<{
    id: string;
    file_url: string;
    verified: boolean;
  }>({
    paramName: MODALS.CORPORATE_MANAGEMENT.CHILDREN.VIEW_KYC_DOCUMENT,
  });

  const fileUrl = modal.modalData?.file_url ?? '';

  const fileType = fileUrl
    ? (() => {
        try {
          return (
            new URL(fileUrl).pathname.split('.').pop()?.toLowerCase() ?? ''
          );
        } catch {
          return fileUrl.split('.').pop()?.toLowerCase() ?? '';
        }
      })()
    : '';

  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(
    fileType
  );

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
            {fileUrl ? (
              isImage ? (
                <div className="flex justify-center items-center p-4">
                  <img
                    src={fileUrl}
                    alt="KYC Document"
                    className="max-w-full max-h-[700px] object-contain"
                  />
                </div>
              ) : isPdf ? (
                <DocViewer
                  documents={[
                    {
                      uri: fileUrl,
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
                      uri: fileUrl,
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
