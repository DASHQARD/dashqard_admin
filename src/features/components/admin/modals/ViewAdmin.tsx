import { Avatar, Modal, Text, Loader } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { MODALS } from '@/utils/constants';
import { adminManagementQueries } from '@/features/hooks/adminManagement';
import { formatDate } from '@/utils';
import React from 'react';

type AdminData = {
  id: number | string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  status?: string;
  type?: string;
  role_id?: number | null;
  avatar?: string | null;
  created_at?: string;
  updated_at?: string;
};

export function ViewAdmin() {
  const modal = usePersistedModalState<AdminData>({
    paramName: MODALS.ADMIN.PARAM_NAME,
  });

  const { useGetAdminDetails } = adminManagementQueries();
  const adminId = String(modal.modalData?.id || '');
  const { data: adminData, isLoading } = useGetAdminDetails(adminId);

  const admin = React.useMemo(() => {
    return adminData || modal.modalData;
  }, [adminData, modal.modalData]);

  if (!admin) {
    return null;
  }

  const fullName =
    `${admin.first_name || ''} ${admin.last_name || ''}`.trim() || 'N/A';

  return (
    <Modal
      panelClass="!w-[680px] min-w-full"
      title="Admin Details"
      isOpen={modal.isModalOpen(MODALS.ADMIN.VIEW)}
      setIsOpen={(isOpen) => {
        if (!isOpen) {
          modal.closeModal();
        }
      }}
      position="side"
    >
      <div className="h-full px-6 flex flex-col gap-6 justify-between">
        <div className="grow overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Profile Section */}
              <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                <Avatar
                  src={admin.avatar || undefined}
                  name={fullName}
                  size="lg"
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <Text variant="h4" weight="medium" className="text-gray-800">
                    {fullName}
                  </Text>
                  <Text variant="span" className="text-sm text-gray-500">
                    {admin.email || '-'}
                  </Text>
                </div>
              </div>

              {/* Admin Information */}
              <div className="space-y-4">
                <Text
                  variant="p"
                  weight="medium"
                  className="text-sm text-primary-900"
                >
                  Personal Information
                </Text>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Text variant="p" className="text-gray-400 text-xs">
                      Admin ID
                    </Text>
                    <Text
                      variant="p"
                      className="text-sm text-gray-800 font-medium"
                    >
                      {admin.id || '-'}
                    </Text>
                  </div>

                  <div className="space-y-1">
                    <Text variant="p" className="text-gray-400 text-xs">
                      Email
                    </Text>
                    <Text variant="p" className="text-sm text-gray-800">
                      {admin.email || '-'}
                    </Text>
                  </div>

                  <div className="space-y-1">
                    <Text variant="p" className="text-gray-400 text-xs">
                      First Name
                    </Text>
                    <Text variant="p" className="text-sm text-gray-800">
                      {admin.first_name || '-'}
                    </Text>
                  </div>

                  <div className="space-y-1">
                    <Text variant="p" className="text-gray-400 text-xs">
                      Last Name
                    </Text>
                    <Text variant="p" className="text-sm text-gray-800">
                      {admin.last_name || '-'}
                    </Text>
                  </div>

                  <div className="space-y-1">
                    <Text variant="p" className="text-gray-400 text-xs">
                      Phone Number
                    </Text>
                    <Text variant="p" className="text-sm text-gray-800">
                      {admin.phone_number || '-'}
                    </Text>
                  </div>

                  <div className="space-y-1">
                    <Text variant="p" className="text-gray-400 text-xs">
                      Type
                    </Text>
                    <Text variant="p" className="text-sm text-gray-800">
                      {admin.type || '-'}
                    </Text>
                  </div>

                  <div className="space-y-1">
                    <Text variant="p" className="text-gray-400 text-xs">
                      Role ID
                    </Text>
                    <Text variant="p" className="text-sm text-gray-800">
                      {admin.role_id || '-'}
                    </Text>
                  </div>

                  <div className="space-y-1">
                    <Text variant="p" className="text-gray-400 text-xs">
                      Status
                    </Text>
                    <Text
                      variant="p"
                      className="text-sm text-gray-800 capitalize"
                    >
                      {admin.status || '-'}
                    </Text>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              {(admin.created_at || admin.updated_at) && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <Text
                    variant="p"
                    weight="medium"
                    className="text-sm text-primary-900"
                  >
                    Account Information
                  </Text>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {admin.created_at && (
                      <div className="space-y-1">
                        <Text variant="p" className="text-gray-400 text-xs">
                          Created At
                        </Text>
                        <Text variant="p" className="text-sm text-gray-800">
                          {formatDate(admin.created_at)}
                        </Text>
                      </div>
                    )}

                    {admin.updated_at && (
                      <div className="space-y-1">
                        <Text variant="p" className="text-gray-400 text-xs">
                          Updated At
                        </Text>
                        <Text variant="p" className="text-sm text-gray-800">
                          {formatDate(admin.updated_at)}
                        </Text>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
