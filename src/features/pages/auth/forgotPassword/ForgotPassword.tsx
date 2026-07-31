import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import React from 'react';

import { Input, Text } from '@/components';
import { Button } from '@/components/Button';
import { Icon } from '@/libs';
import { useAuth } from '@/features/hooks/auth';
import { ForgotPasswordSchema } from '@/utils/schemas';
import { ROUTES } from '@/utils/constants';

type ForgotPasswordForm = z.infer<typeof ForgotPasswordSchema>;

export default function ForgotPassword() {
  const { useForgotAdminPassword } = useAuth();
  const { mutate, isPending, isSuccess } = useForgotAdminPassword();
  const [submitted, setSubmitted] = React.useState(false);

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = (data: ForgotPasswordForm) => {
    mutate(
      { email: data.email.trim().toLowerCase() },
      {
        onSuccess: () => {
          setSubmitted(true);
        },
      }
    );
  };

  return (
    <div className="flex relative min-h-screen overflow-hidden">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-[470.61px] w-full flex flex-col gap-10">
          <div className="flex items-center gap-3">
            <div className="bg-primary-500 rounded-full p-2 h-10 w-10 flex items-center justify-center">
              <Icon icon="bi:envelope-lock" className="size-5 text-white" />
            </div>
            <div>
              <Text as="h2" className="text-2xl font-bold">
                Forgot password
              </Text>
              <p className="text-sm text-gray-500">
                Enter your admin email and we&apos;ll send a reset link if an
                account exists
              </p>
            </div>
          </div>

          {submitted || isSuccess ? (
            <div className="flex flex-col gap-6">
              <p className="text-sm text-[#5F6166]">
                If an account exists for that address, we&apos;ve sent a reset
                link. Check your inbox — you can request another link in 15
                minutes.
              </p>
              <Link
                to={ROUTES.IN_APP.ADMIN.AUTH.LOGIN}
                className="text-primary-500 underline text-sm"
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <Input
                label="Email"
                placeholder="Enter your email"
                {...form.register('email')}
                error={form.formState.errors.email?.message}
              />
              <Button
                type="submit"
                variant="secondary"
                className="w-full"
                loading={isPending}
                disabled={isPending}
              >
                Send reset link
              </Button>
              <hr className="border-gray-200" />
              <p className="text-sm">
                Remember your password?{' '}
                <Link
                  to={ROUTES.IN_APP.ADMIN.AUTH.LOGIN}
                  className="text-primary-500 underline"
                >
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
