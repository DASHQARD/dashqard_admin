import { Button, Modal, Text, Tag } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { MODALS } from '@/utils/constants';
import { rolesManagementQueries } from '@/features/hooks/rolesManagement';
import { formatDate } from '@/utils/helpers/common';
import React from 'react';

type RoleData = {
  id: number | string;
  role?: string;
  description?: string;
};

export function ViewRole() {
  const modal = usePersistedModalState<RoleData>({
    paramName: MODALS.ROLES_MANAGEMENT.PARAM_NAME,
  });

  const { useGetSingleRole, useGetRolePermissions } = rolesManagementQueries();
  const roleId = String(modal.modalData?.id || '');
  const { data: roleData } = useGetSingleRole(roleId);
  const { data: rolePermissionsData, isLoading: isLoadingPermissions } =
    useGetRolePermissions(roleId);

  // Group permissions by category
  const permissionsByCategory = React.useMemo(() => {
    if (!rolePermissionsData || !Array.isArray(rolePermissionsData)) return {};

    const grouped: Record<
      string,
      Array<{ permission: string; description?: string }>
    > = {};

    rolePermissionsData.forEach((p: any) => {
      if (p.permission) {
        const category = p.category || 'uncategorized';
        if (!grouped[category]) {
          grouped[category] = [];
        }
        grouped[category].push({
          permission: p.permission,
          description: p.description,
        });
      }
    });

    return grouped;
  }, [rolePermissionsData]);

  const totalPermissions = React.useMemo(() => {
    return Object.values(permissionsByCategory).reduce(
      (sum, perms) => sum + perms.length,
      0
    );
  }, [permissionsByCategory]);

  const role = roleData || modal.modalData;

  if (!role) {
    return null;
  }

  return (
    <Modal
      panelClass="!w-[680px] min-w-full"
      title="Role Details"
      isOpen={modal.isModalOpen(MODALS.ROLES_MANAGEMENT.CHILDREN.VIEW)}
      setIsOpen={(isOpen) => {
        if (!isOpen) {
          modal.closeModal();
        }
      }}
      position="side"
    >
      <div className="h-full px-6 flex flex-col gap-6 justify-between">
        <div className="grow overflow-y-auto">
          <div className="space-y-4">
            <div className="space-y-1">
              <Text variant="p" className="text-gray-400 text-xs">
                Role Name
              </Text>
              <Text variant="p" className="text-sm text-gray-800 font-medium">
                {role.role || '-'}
              </Text>
            </div>

            <div className="space-y-1">
              <Text variant="p" className="text-gray-400 text-xs">
                Description
              </Text>
              <Text variant="p" className="text-sm text-gray-800">
                {role.description || '-'}
              </Text>
            </div>

            <div className="space-y-1">
              <Text variant="p" className="text-gray-400 text-xs">
                Role ID
              </Text>
              <Text variant="p" className="text-sm text-gray-800">
                {role.id || '-'}
              </Text>
            </div>

            {role.created_at && (
              <div className="space-y-1">
                <Text variant="p" className="text-gray-400 text-xs">
                  Created At
                </Text>
                <Text variant="p" className="text-sm text-gray-800">
                  {formatDate(role.created_at, 'DD MMM YYYY, HH:mm')}
                </Text>
              </div>
            )}

            {role.updated_at && (
              <div className="space-y-1">
                <Text variant="p" className="text-gray-400 text-xs">
                  Updated At
                </Text>
                <Text variant="p" className="text-sm text-gray-800">
                  {formatDate(role.updated_at, 'DD MMM YYYY, HH:mm')}
                </Text>
              </div>
            )}

            <hr className="my-6 border-gray-200" />

            <div className="space-y-4">
              <Text
                variant="p"
                weight="medium"
                className="text-sm text-primary-900"
              >
                Permissions ({totalPermissions})
              </Text>
              {isLoadingPermissions ? (
                <Text variant="p" className="text-sm text-gray-400">
                  Loading permissions...
                </Text>
              ) : totalPermissions > 0 ? (
                <div className="space-y-6">
                  {Object.entries(permissionsByCategory).map(
                    ([category, perms]) => (
                      <div key={category} className="space-y-2">
                        <Text
                          variant="p"
                          weight="medium"
                          className="text-xs text-gray-500 uppercase tracking-wide"
                        >
                          {category.replace(/_/g, ' ')}
                        </Text>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {perms.map((perm, index) => (
                            <Tag
                              key={`${category}-${index}`}
                              value={perm.permission}
                              variant="gray"
                            />
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <Text variant="p" className="text-sm text-gray-400">
                  No permissions assigned
                </Text>
              )}
            </div>
          </div>
        </div>

        <div>
          <Button variant={'outline'} onClick={modal.closeModal}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
