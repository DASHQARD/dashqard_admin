import { Profile as ProfileComponent, Text, Loader } from '@/components';
import { useAdminService } from '@/features/hooks/useAdminService';
import { formatDate } from '@/utils';
import React from 'react';

export default function Profile() {
  const { useAdminProfile } = useAdminService();
  const { data: adminProfile, isLoading } = useAdminProfile();

  const adminInfo = React.useMemo(() => {
    if (!adminProfile) return [];

    return [
      {
        label: 'Admin ID',
        value: adminProfile.id || '-',
      },
      {
        label: 'Email',
        value: adminProfile.email || '-',
      },
      {
        label: 'First Name',
        value: adminProfile.first_name || '-',
      },
      {
        label: 'Last Name',
        value: adminProfile.last_name || '-',
      },
      {
        label: 'Phone Number',
        value: adminProfile.phone_number || '-',
      },
      {
        label: 'Role ID',
        value: adminProfile.role_id || '-',
      },
      {
        label: 'Type',
        value: adminProfile.type || '-',
      },
      {
        label: 'Date Joined',
        value: adminProfile.created_at
          ? formatDate(adminProfile.created_at)
          : '-',
      },
      {
        label: 'Last Updated',
        value: adminProfile.updated_at
          ? formatDate(adminProfile.updated_at)
          : '-',
      },
    ];
  }, [adminProfile]);

  if (isLoading) {
    return (
      <div className="lg:py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader />
        </div>
      </div>
    );
  }

  if (!adminProfile) {
    return (
      <div className="lg:py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <Text variant="p">No profile data found</Text>
        </div>
      </div>
    );
  }

  const fullName =
    `${adminProfile.first_name || ''} ${adminProfile.last_name || ''}`.trim() ||
    'Admin User';
  const roleName = adminProfile.role_id
    ? `Role ${adminProfile.role_id}`
    : 'No Role';

  return (
    <div className="lg:py-10">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <Text variant="h2" weight="semibold" className="text-primary-900">
            Profile
          </Text>
        </div>

        <ProfileComponent
          name={fullName}
          businessName={roleName}
          status={adminProfile.status || 'active'}
        >
          <div className="flex flex-col gap-6 w-full">
            <Text variant="h5" weight="medium">
              Personal Information
            </Text>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {adminInfo.map((item) => (
                <div className="flex flex-col gap-1 min-w-0" key={item.label}>
                  <p className="text-xs text-gray-400 whitespace-nowrap">
                    {item.label}
                  </p>
                  <Text
                    variant="span"
                    className="wrap-break-word overflow-hidden"
                  >
                    {item.value}
                  </Text>
                </div>
              ))}
            </section>
          </div>
        </ProfileComponent>
      </div>
    </div>
  );
}
