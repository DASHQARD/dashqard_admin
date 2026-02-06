import { Button, PaginatedTable, Text } from '@/components';
import { useSuperAdminInvitationsManagementBase } from '@/features/hooks/superAdminInvitationsManagement';
import { usePersistedModalState } from '@/hooks';
import { MODALS, OPTIONS } from '@/utils/constants';
import {
  invitationListColumns,
  invitationListCsvHeaders,
  CreateSuperAdminInvitation,
  DeleteSuperAdminInvitation,
  UpdateSuperAdminInvitationStatus,
} from '@/features/components/superAdminInvitations';

export default function SuperAdminInvitations() {
  const {
    query,
    setQuery,
    invitationsList,
    isLoadingInvitations,
    totalCount,
    pagination,
    handleNextPage,
    handleSetAfter,
  } = useSuperAdminInvitationsManagementBase();

  const modal = usePersistedModalState({
    paramName: MODALS.SUPER_ADMIN_INVITATIONS_MANAGEMENT.PARAM_NAME,
  });

  return (
    <>
      <div className="lg:py-10">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="h2" weight="semibold" className="text-primary-900">
                Corporate Onboarding Invitations
              </Text>
              <Text variant="p" className="text-gray-600 mt-2">
                Invite corporate accounts to onboard on the dashboard website
              </Text>
            </div>
            <Button
              variant="secondary"
              onClick={() =>
                modal.openModal(
                  MODALS.SUPER_ADMIN_INVITATIONS_MANAGEMENT.CHILDREN.CREATE
                )
              }
            >
              Invite Corporate Account
            </Button>
          </div>
          <div className="relative space-y-[37px]">
            <div className="text-[#0c4b77] py-2 border-b-2 border-[#0c4b77] w-fit">
              <Text variant="h6" weight="medium">
                All Corporate Invitations
              </Text>
            </div>
            <PaginatedTable
              filterWrapperClassName="lg:absolute lg:top-0 lg:right-[2px]"
              columns={invitationListColumns}
              data={invitationsList || []}
              total={totalCount || 0}
              loading={isLoadingInvitations}
              query={query}
              setQuery={setQuery}
              searchPlaceholder="Search by email, fullname, phone number, business name, or business location..."
              csvHeaders={invitationListCsvHeaders}
              filterBy={{
                simpleSelects: [
                  {
                    label: 'status',
                    options: OPTIONS.SUPER_ADMIN_INVITATIONS_STATUS,
                  },
                ],
              }}
              printTitle="Corporate Onboarding Invitations"
              hasNextPage={pagination?.hasNextPage}
              hasPreviousPage={pagination?.hasPreviousPage}
              currentAfter={
                (query as any).after ? String((query as any).after) : undefined
              }
              previousCursor={pagination?.previous || null}
              onNextPage={handleNextPage}
              onPreviousPage={() => {
                // Handle previous page
                const queryWithAfter = query as any;
                if (queryWithAfter.after && pagination?.previous) {
                  handleSetAfter(pagination.previous);
                } else {
                  // Reset to first page
                  handleSetAfter('');
                }
              }}
              onSetAfter={handleSetAfter}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateSuperAdminInvitation />
      <DeleteSuperAdminInvitation />
      <UpdateSuperAdminInvitationStatus />
    </>
  );
}
