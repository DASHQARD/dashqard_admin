import { RoleCard } from './RoleCard';
import { Loader } from '@/components';

type Role = {
  id: number | string;
  role: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  permissions?: string[] | Array<{ permission: string }>;
};

type RolesListProps = {
  roles: Role[];
  isLoading: boolean;
};

export function RolesList({ roles, isLoading }: RolesListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader />
      </div>
    );
  }

  if (roles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No roles found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {roles.map((role) => (
        <RoleCard key={role.id} role={role} />
      ))}
    </div>
  );
}
