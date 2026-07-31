import { Button, Modal, Text } from '@/components';
import { adminManagementMutations } from '@/features/hooks/adminManagement';
import { usePersistedModalState } from '@/hooks';
import { MODALS } from '@/utils/constants';

type AdminData = {
  id: string | number;
  first_name?: string;
  last_name?: string;
  email?: string;
};

export function ResendAdminInvite() {
  const modal = usePersistedModalState<AdminData>({
    paramName: MODALS.ADMIN.PARAM_NAME,
  });

  const { useResendAdminInvitation } = adminManagementMutations();
  const resendMutation = useResendAdminInvitation();

  const displayName =
    `${modal.modalData?.first_name || ''} ${modal.modalData?.last_name || ''}`.trim() ||
    modal.modalData?.email ||
    'this admin';

  const handleResend = () => {
    if (!modal.modalData?.id) return;

    resendMutation.mutate(String(modal.modalData.id), {
      onSuccess: () => {
        modal.closeModal();
      },
      onError: (err: { status?: number }) => {
        // Rate limited — still close so the user isn't stuck; toast already shown
        if (err?.status === 429) {
          modal.closeModal();
        }
      },
    });
  };

  return (
    <Modal
      panelClass="!w-[500px]"
      title="Resend Invitation"
      isOpen={modal.isModalOpen(MODALS.ADMIN.RESEND_INVITE)}
      setIsOpen={(isOpen) => {
        if (!isOpen) {
          modal.closeModal();
        }
      }}
      position="center"
    >
      <div className="p-6 flex flex-col gap-6">
        <Text variant="h3" className="font-semibold">
          Resend the onboarding invitation to <strong>{displayName}</strong>?
          The previous invitation link will stop working immediately.
        </Text>
        <p className="text-sm text-[#5F6166]">
          Invitations can only be resent once every 5 minutes.
        </p>

        <div className="flex gap-4 justify-end pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => modal.closeModal()}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleResend}
            disabled={resendMutation.isPending}
            loading={resendMutation.isPending}
          >
            {resendMutation.isPending ? 'Sending...' : 'Resend Invitation'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
