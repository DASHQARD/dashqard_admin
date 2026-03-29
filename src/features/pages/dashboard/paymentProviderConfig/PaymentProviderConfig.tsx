import { useEffect } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import { Button, Combobox, Loader, Text } from '@/components';
import { useCustomForm } from '@/libs';
import {
  paymentProviderConfigManagementMutations,
  paymentProviderConfigManagementQueries,
} from '@/features/hooks/paymentProviderConfigManagement';

type PaymentProviderConfigForm = {
  checkout_gateway: string;
  payout_service: string;
};

export default function PaymentProviderConfig() {
  const { useGetPaymentProviderConfig } =
    paymentProviderConfigManagementQueries();
  const { data: paymentProviderConfig, isLoading } =
    useGetPaymentProviderConfig();

  const { useUpdatePaymentProviderConfig } =
    paymentProviderConfigManagementMutations();
  const updateMutation = useUpdatePaymentProviderConfig();

  const form = useCustomForm<PaymentProviderConfigForm>({
    defaultValues: {
      checkout_gateway: '',
      payout_service: '',
    },
  });

  useEffect(() => {
    if (!paymentProviderConfig) return;
    form.reset({
      checkout_gateway: paymentProviderConfig.checkout_gateway ?? '',
      payout_service: paymentProviderConfig.payout_service ?? '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentProviderConfig]);

  const gateways = [
    { label: 'Paystack', value: 'paystack' },
    { label: 'Eganow', value: 'eganow' },
    { label: 'Kowri', value: 'kowri' },
    { label: 'ExpressPay', value: 'expresspay' },
  ];

  const payoutServices = gateways;

  const onSubmit: SubmitHandler<PaymentProviderConfigForm> = (data) => {
    updateMutation.mutate(
      {
        checkout_gateway: data.checkout_gateway,
        payout_service: data.payout_service,
      },
      {
        onSuccess: () => {
          form.reset(data);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="lg:py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader />
        </div>
      </div>
    );
  }

  if (!paymentProviderConfig) {
    return (
      <div className="lg:py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <Text variant="p">No payment provider configuration found</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:py-10">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <Text variant="h2" weight="semibold" className="text-primary-900">
            Payment Provider Configuration
          </Text>
        </div>

        <div className="relative space-y-[37px]">
          <div className="text-[#0c4b77] py-2 border-b-2 border-[#0c4b77] w-fit">
            <Text variant="h6" weight="medium">
              Configure Payment Providers
            </Text>
          </div>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-white rounded-lg border border-gray-200 p-6 space-y-6 max-w-2xl"
          >
            <div className="flex flex-col gap-6">
              <Controller
                control={form.control}
                name="checkout_gateway"
                render={({ field }) => (
                  <Combobox
                    label="Checkout Gateway"
                    placeholder="Select checkout gateway"
                    options={gateways}
                    value={field.value}
                    name={field.name}
                    error={form.formState.errors.checkout_gateway?.message}
                    onChange={field.onChange}
                  />
                )}
              />

              <Controller
                control={form.control}
                name="payout_service"
                render={({ field }) => (
                  <Combobox
                    label="Payout Service"
                    placeholder="Select payout service"
                    options={payoutServices}
                    value={field.value}
                    name={field.name}
                    error={form.formState.errors.payout_service?.message}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                variant="secondary"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending
                  ? 'Updating...'
                  : 'Update Payment Providers'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
