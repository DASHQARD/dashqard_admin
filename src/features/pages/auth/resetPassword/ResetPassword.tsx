import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import React from 'react';

import { Input, Text } from '@/components';
import { Button } from '@/components/Button';
import { Icon } from '@/libs';
import { useAuth } from '@/features/hooks/auth';
import { ResetPasswordSchema } from '@/utils/schemas';
import { ROUTES } from '@/utils/constants';

type ResetPasswordForm = z.infer<typeof ResetPasswordSchema>;

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const { useResetAdminPassword } = useAuth();
  const { mutate, isPending } = useResetAdminPassword();
  const [tokenError, setTokenError] = React.useState(false);

  const vtoken = (() => {
    const normalToken = searchParams.get('vtoken');
    if (normalToken) return normalToken.trim();

    const urlSearchString = window.location.search;
    const match = urlSearchString.match(/vtoken[%3D=]([a-f0-9-]+)/i);
    return match ? match[1] : null;
  })();

  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: ResetPasswordForm) => {
    if (!vtoken) return;

    mutate(
      {
        token: vtoken,
        password: data.password,
      },
      {
        onError: (err: any) => {
          if (
            err?.status === 401 ||
            err?.status === 404 ||
            String(err?.message || '')
              .toLowerCase()
              .includes('invalid or expired')
          ) {
            setTokenError(true);
          }
        },
      }
    );
  };

  if (!vtoken || tokenError) {
    return (
      <div className="flex relative min-h-screen overflow-hidden">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-[470.61px] w-full flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary-500 rounded-full p-2 h-10 w-10 flex items-center justify-center">
                <Icon icon="bi:shield-lock" className="size-5 text-white" />
              </div>
              <div>
                <Text as="h2" className="text-2xl font-bold">
                  Reset link unavailable
                </Text>
                <p className="text-sm text-gray-500">
                  This reset link is missing, invalid, or has expired.
                </p>
              </div>
            </div>
            <p className="text-sm text-[#5F6166]">
              Request a new password reset link to continue.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                to={ROUTES.IN_APP.AUTH.FORGOT_PASSWORD}
                className="inline-flex justify-center rounded-lg bg-primary-500 px-4 py-3 text-sm font-medium text-white"
              >
                Request a new link
              </Link>
              <Link
                to={ROUTES.IN_APP.ADMIN.AUTH.LOGIN}
                className="text-primary-500 underline text-sm text-center"
              >
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex relative min-h-screen overflow-hidden">
      <div className="flex-1 flex items-center justify-center p-4">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-[470.61px] w-full flex flex-col gap-10"
        >
          <div className="flex items-center gap-3">
            <div className="bg-primary-500 rounded-full p-2 h-10 w-10 flex items-center justify-center">
              <Icon icon="bi:shield-lock" className="size-5 text-white" />
            </div>
            <div>
              <Text as="h2" className="text-2xl font-bold">
                Reset password
              </Text>
              <p className="text-sm text-gray-500">
                Choose a new password for your admin account
              </p>
            </div>
          </div>

          <section className="flex flex-col gap-4">
            <Input
              label="New password"
              placeholder="Enter new password"
              type="password"
              {...form.register('password')}
              error={form.formState.errors.password?.message}
            />
            <Input
              label="Confirm password"
              placeholder="Re-enter new password"
              type="password"
              {...form.register('confirmPassword')}
              error={form.formState.errors.confirmPassword?.message}
            />
            <p className="text-xs text-gray-400">
              Must be 8–128 characters with at least one uppercase letter, one
              lowercase letter, and one number.
            </p>
            <Button
              type="submit"
              variant="secondary"
              className="w-full"
              loading={isPending}
              disabled={isPending}
            >
              Reset password
            </Button>
            <hr className="border-gray-200" />
            <p className="text-sm">
              Link expired?{' '}
              <Link
                to={ROUTES.IN_APP.AUTH.FORGOT_PASSWORD}
                className="text-primary-500 underline"
              >
                Request a new one
              </Link>
            </p>
          </section>
        </form>
      </div>
    </div>
  );
}
