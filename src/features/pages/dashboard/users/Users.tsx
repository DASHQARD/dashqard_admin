import { PaginatedTable, Text } from '@/components';

import { OPTIONS } from '@/utils/constants';
import { useUsersManagementBase } from '@/features/hooks';
import { userListColumns, userListCsvHeaders } from '@/features/components';
import { ManageUserStatusModal } from './ManageUserStatusModal';
import { ViewUserModal } from './ViewUserModal';

export default function Users() {
  const { users, isLoadingUsers, query, setQuery } = useUsersManagementBase();

  return (
    <>
      <div className="lg:py-10">
        <div className="flex flex-col gap-8">
          <Text variant="h2" weight="semibold" className="text-primary-900">
            Users Management
          </Text>
          <div className="relative space-y-[37px]">
            <div className="text-[#0c4b77] py-2 border-b-2 border-[#0c4b77] w-fit">
              <Text variant="h6" weight="medium">
                All Users
              </Text>
            </div>
            <PaginatedTable
              filterWrapperClassName="lg:absolute lg:top-0 lg:right-[2px]"
              columns={userListColumns}
              data={users || []}
              total={users?.length || 0}
              loading={isLoadingUsers}
              query={query}
              setQuery={setQuery}
              searchPlaceholder="Search users by name or email..."
              csvHeaders={userListCsvHeaders}
              filterBy={{
                simpleSelects: [
                  {
                    label: 'status',
                    options: OPTIONS.TRANSACTION_STATUS,
                  },
                ],
              }}
              printTitle="Users"
            />
          </div>
        </div>
      </div>
      <ManageUserStatusModal />
      <ViewUserModal />
    </>
  );
}
