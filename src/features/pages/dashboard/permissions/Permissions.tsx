import {
  Button,
  PaginatedTable,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Text,
} from '@/components';
import {
  permissionListColumns,
  permissionListCsvHeaders,
  CreatePermission,
  EditPermission,
  DeletePermission,
} from '@/features/components/permissions';
import { usePermissionsManagementBase } from '@/features/hooks/permissionsManagement';
import { useRolesManagementBase } from '@/features/hooks/rolesManagement';
import { usePersistedModalState } from '@/hooks';
import { MODALS } from '@/utils/constants';
import {
  RolesList,
  CreateRole,
  EditRole,
  DeleteRole,
  ViewRole,
} from '@/features/components/roles';
import { useState } from 'react';

export default function Permissions() {
  const [activeTab, setActiveTab] = useState('roles');

  const { query, setQuery, permissionsList, isLoadingPermissions } =
    usePermissionsManagementBase();
  const { rolesList, isLoadingRoles } = useRolesManagementBase();

  const modal = usePersistedModalState({
    paramName: MODALS.PERMISSIONS_MANAGEMENT.PARAM_NAME,
  });

  const roleModal = usePersistedModalState({
    paramName: MODALS.ROLES_MANAGEMENT.PARAM_NAME,
  });

  return (
    <>
      <div className="lg:py-10">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <Text variant="h2" weight="semibold" className="text-primary-900">
              Roles & Permissions
            </Text>
            {activeTab === 'permissions' && (
              <Button
                variant="secondary"
                onClick={() =>
                  modal.openModal(MODALS.PERMISSIONS_MANAGEMENT.CHILDREN.CREATE)
                }
              >
                Create Permission
              </Button>
            )}
            {activeTab === 'roles' && (
              <Button
                variant="secondary"
                onClick={() =>
                  roleModal.openModal(MODALS.ROLES_MANAGEMENT.CHILDREN.CREATE)
                }
              >
                Create Role
              </Button>
            )}
          </div>
          <div className="relative space-y-[37px]">
            <div className="text-[#0c4b77] py-2 border-b-2 border-[#0c4b77] w-fit">
              <Text variant="h6" weight="medium">
                {activeTab === 'roles' ? 'All Roles' : 'All Permissions'}
              </Text>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="roles">Roles</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
              </TabsList>
              <TabsContent value="roles" className="mt-6">
                <RolesList roles={rolesList} isLoading={isLoadingRoles} />
              </TabsContent>
              <TabsContent value="permissions" className="mt-6">
                <PaginatedTable
                  filterWrapperClassName="lg:absolute lg:top-0 lg:right-[2px]"
                  columns={permissionListColumns}
                  data={permissionsList || []}
                  total={permissionsList?.length || 0}
                  loading={isLoadingPermissions}
                  query={query}
                  setQuery={setQuery}
                  searchPlaceholder="Search by permission or category..."
                  csvHeaders={permissionListCsvHeaders}
                  printTitle="Permissions"
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreatePermission />
      <EditPermission />
      <DeletePermission />
      <CreateRole />
      <EditRole />
      <DeleteRole />
      <ViewRole />
    </>
  );
}
