import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ROUTES } from '@/utils/constants';
import { Input, Text } from '@/components';
import { Button } from '@/components/Button';
import { Icon } from '@/libs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAdminOnboarding } from '@/features/hooks';

const AdminOnboardingFormSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  });

export default function AdminOnboarding() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const vtoken = (() => {
    const normalToken = searchParams.get('vtoken');
    if (normalToken) return normalToken;

    const urlSearchString = window.location.search;
    const match = urlSearchString.match(/vtoken[%3D=]([a-f0-9-]+)/i);
    return match ? match[1] : null;
  })();

  const { mutate: onboard, isPending } = useAdminOnboarding();
  const form = useForm<z.infer<typeof AdminOnboardingFormSchema>>({
    resolver: zodResolver(AdminOnboardingFormSchema),
  });

  useEffect(() => {
    if (!vtoken) {
      navigate(ROUTES.IN_APP.ADMIN.AUTH.LOGIN);
    }
  }, [vtoken, navigate]);

  const onSubmit = (data: z.infer<typeof AdminOnboardingFormSchema>) => {
    if (!vtoken) return;

    onboard({
      verification_code: vtoken,
      password: data.password,
    });
  };

  if (!vtoken) {
    return null;
  }

  return (
    <div className="flex relative min-h-screen overflow-hidden">
      <div className="flex-1 flex items-center justify-center">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-[470.61px] w-full flex flex-col gap-10"
        >
          <div className="flex items-center gap-3">
            <div className="bg-primary-500 rounded-full p-2 h-10 w-10 flex items-center justify-center">
              <Icon icon="bi:person-gear" className="size-5 text-white" />
            </div>
            <div>
              <Text as="h2" className="text-2xl font-bold">
                Complete Your Onboarding
              </Text>
              <p className="text-sm text-gray-500">
                Set up your admin account to get started
              </p>
            </div>
          </div>
          <section className="flex flex-col gap-4">
            <Input
              label="Password"
              placeholder="Enter your password"
              type="password"
              {...form.register('password')}
              error={form.formState.errors.password?.message}
            />
            <Input
              label="Confirm Password"
              placeholder="Re-enter your password"
              type="password"
              {...form.register('confirm_password')}
              error={form.formState.errors.confirm_password?.message}
            />
            <Button
              disabled={!form.formState.isValid || isPending}
              loading={isPending}
              type="submit"
              variant="secondary"
              className="w-full"
            >
              Complete Onboarding
            </Button>

            <hr className="border-gray-200" />
            <div className="flex items-center gap-2">
              <p>
                Already have an account?{' '}
                <Link
                  to={ROUTES.IN_APP.ADMIN.AUTH.LOGIN}
                  className="text-primary-500 underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
}
