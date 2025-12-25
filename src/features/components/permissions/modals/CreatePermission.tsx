import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Modal, Text } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { useCustomForm } from '@/libs';
import { MODALS } from '@/utils/constants';
import { permissionsManagementMutations } from '@/features/hooks/permissionsManagement';
import { z } from 'zod';
import { useFieldArray } from 'react-hook-form';

const permissionSchema = z.object({
  permission: z.string().min(1, 'Permission is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
});

const createPermissionsSchema = z.object({
  permissions: z
    .array(permissionSchema)
    .min(1, 'At least one permission is required'),
});

type CreatePermissionsSchemaType = z.infer<typeof createPermissionsSchema>;

export function CreatePermission() {
  const modal = usePersistedModalState({
    paramName: MODALS.PERMISSIONS_MANAGEMENT.PARAM_NAME,
  });

  const { useCreatePermissions } = permissionsManagementMutations();
  const createPermissionsMutation = useCreatePermissions();

  const form = useCustomForm({
    resolver: zodResolver(createPermissionsSchema),
    defaultValues: {
      permissions: [
        {
          permission: '',
          category: '',
          description: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'permissions',
  });

  const onSubmit: SubmitHandler<CreatePermissionsSchemaType> = (data) => {
    createPermissionsMutation.mutate(data, {
      onSuccess: () => {
        modal.closeModal();
        form.reset();
      },
    });
  };

  return (
    <Modal
      panelClass="!w-[680px]"
      title="Create Permissions"
      isOpen={modal.isModalOpen(MODALS.PERMISSIONS_MANAGEMENT.CHILDREN.CREATE)}
      setIsOpen={(isOpen) => {
        if (!isOpen) {
          modal.closeModal();
          form.reset();
        }
      }}
      position="center"
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="p-6 flex flex-col gap-6 max-h-[80vh] overflow-y-auto">
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border border-gray-200 rounded-lg p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <Text variant="h6" weight="medium">
                    Permission {index + 1}
                  </Text>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => remove(index)}
                      className="text-error"
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <Input
                  label="Permission"
                  placeholder="e.g., vendors:view"
                  {...form.register(`permissions.${index}.permission`)}
                  error={
                    form.formState.errors.permissions?.[index]?.permission
                      ?.message
                  }
                />
                <Input
                  label="Category"
                  placeholder="e.g., vendors"
                  {...form.register(`permissions.${index}.category`)}
                  error={
                    form.formState.errors.permissions?.[index]?.category
                      ?.message
                  }
                />
                <Input
                  label="Description"
                  placeholder="e.g., View vendor details"
                  {...form.register(`permissions.${index}.description`)}
                  error={
                    form.formState.errors.permissions?.[index]?.description
                      ?.message
                  }
                />
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                permission: '',
                category: '',
                description: '',
              })
            }
          >
            Add Another Permission
          </Button>

          <div className="flex items-center gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={modal.closeModal}
              className="grow"
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              loading={createPermissionsMutation.isPending}
              type="submit"
              className="grow"
            >
              Create Permissions
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
