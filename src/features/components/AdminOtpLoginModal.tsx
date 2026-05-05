import React from 'react';
import { useAuth } from '../hooks';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, OTPInput, Text } from '@/components';
import { z } from 'zod';
import { VerifyLoginOTPSchema } from '@/utils/schemas';
import { Icon } from '@/libs';

type Props = {
  sessionId: string;
  onBackToLogin: () => void;
};

export default function AdminOtpLoginModal({ sessionId, onBackToLogin }: Props) {
  const { useVerifyLoginTokenService } = useAuth();
  const { mutate, isPending } = useVerifyLoginTokenService();
  const [isLockedOut, setIsLockedOut] = React.useState(false);

  const form = useForm<z.infer<typeof VerifyLoginOTPSchema>>({
    resolver: zodResolver(VerifyLoginOTPSchema),
  });

  const handleVerify = (token: string) => {
    mutate(
      { session_id: sessionId, token },
      {
        onError: (error: { status: number; message: string }) => {
          const msg = error?.message ?? '';
          if (
            msg === 'Invalid credentials' ||
            msg.startsWith('Too many failed attempts')
          ) {
            setIsLockedOut(true);
            setTimeout(onBackToLogin, 1500);
          }
        },
      }
    );
  };

  const onSubmit = (data: z.infer<typeof VerifyLoginOTPSchema>) => {
    handleVerify(data.otp);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="bg-primary-500 rounded-full h-10 w-10 flex items-center justify-center">
          <Icon icon="bi:shield-check" className="size-5 text-white" />
        </div>
        <div>
          <Text variant="h4" weight="semibold" className="text-gray-900">
            Enter Verification Code
          </Text>
          <Text variant="span" weight="normal" className="text-gray-600">
            We've sent a 4-digit code to your phone
          </Text>
        </div>
      </div>

      <div className="flex flex-col gap-[18px]">
        <Controller
          control={form.control}
          name="otp"
          render={({ field }) => (
            <OTPInput
              length={4}
              inputType="password"
              inputListClassName="grid grid-cols-4 gap-2"
              {...field}
              secure
              onChange={(value) => {
                field.onChange(value);
                if (value.length === 4) {
                  handleVerify(value);
                }
              }}
            />
          )}
        />
      </div>

      <div className="py-2">
        <Button
          variant="secondary"
          className="w-full rounded-[48px] h-12"
          size="default"
          disabled={!form.formState.isValid || isPending || isLockedOut}
          loading={isPending}
        >
          Verify & Continue
        </Button>
      </div>

      <button
        type="button"
        onClick={onBackToLogin}
        className="text-sm text-primary-500 underline text-center"
      >
        Back to login
      </button>
    </form>
  );
}
