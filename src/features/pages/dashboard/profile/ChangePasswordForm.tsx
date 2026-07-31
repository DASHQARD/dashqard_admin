import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@/components';
import { useAuth } from '@/features/hooks/auth';
import { useCustomForm } from '@/libs';
import { ChangePasswordSchema } from '@/utils/schemas';
import type { z } from 'zod';

type ChangePasswordFormType = z.infer<typeof ChangePasswordSchema>;

export function ChangePasswordForm() {
  const { useChangeAdminPassword } = useAuth();
  const changePasswordMutation = useChangeAdminPassword();

  const form = useCustomForm<ChangePasswordFormType>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (values: ChangePasswordFormType) => {
    changePasswordMutation.mutate(
      {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      },
      {
        onError: (err: any) => {
          if (err?.message === 'Current password is incorrect') {
            form.setError('currentPassword', { message: err.message });
          } else if (
            String(err?.message || '')
              .toLowerCase()
              .includes('cannot reuse') ||
            String(err?.message || '')
              .toLowerCase()
              .includes('same as')
          ) {
            form.setError('newPassword', { message: err.message });
          }
        },
      }
    );
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
    >
      <Input
        label="Current password"
        placeholder="Enter current password"
        type="password"
        {...form.register('currentPassword')}
        error={form.formState.errors.currentPassword?.message}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          label="New password"
          placeholder="Enter new password"
          type="password"
          {...form.register('newPassword')}
          error={form.formState.errors.newPassword?.message}
        />
        <Input
          label="Confirm new password"
          placeholder="Re-enter new password"
          type="password"
          {...form.register('confirmPassword')}
          error={form.formState.errors.confirmPassword?.message}
        />
      </div>
      <p className="text-xs text-gray-400">
        Must be 8–128 characters with at least one uppercase letter, one
        lowercase letter, and one number. You will be signed out after a
        successful change.
      </p>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          className="grow"
          onClick={() => form.reset()}
        >
          Reset
        </Button>
        <Button
          type="submit"
          variant="secondary"
          className="grow"
          loading={changePasswordMutation.isPending}
          disabled={changePasswordMutation.isPending}
        >
          Change password
        </Button>
      </div>
    </form>
  );
}
