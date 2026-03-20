import { useEffect } from 'react';

import { Button, Input, Loader, Text } from '@/components';
import { useCustomForm } from '@/libs';
import {
  cardConfigurationsManagementMutations,
  cardConfigurationsManagementQueries,
} from '@/features/hooks/cardConfigurationsManagement';

export default function CardConfigurations() {
  const { useGetCardConfigurations } = cardConfigurationsManagementQueries();
  const { data: cardConfigurations, isLoading } =
    useGetCardConfigurations();

  const { useUpdateCardConfigurations } =
    cardConfigurationsManagementMutations();
  const updateMutation = useUpdateCardConfigurations();

  const form = useCustomForm({
    defaultValues: {
      min_card_amount: '',
    },
  });

  useEffect(() => {
    if (cardConfigurations) {
      form.reset({
        min_card_amount: String(cardConfigurations.min_card_amount ?? ''),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardConfigurations]);

  const onSubmit = (data: any) => {
    const payload = {
      min_card_amount: Number(data.min_card_amount),
    };

    updateMutation.mutate(payload, {
      onSuccess: () => {
        form.reset(data);
      },
    });
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

  if (!cardConfigurations) {
    return (
      <div className="lg:py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <Text variant="p">No card configuration found</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:py-10">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <Text variant="h2" weight="semibold" className="text-primary-900">
            Card Configurations
          </Text>
        </div>

        <div className="relative space-y-[37px]">
          <div className="text-[#0c4b77] py-2 border-b-2 border-[#0c4b77] w-fit">
            <Text variant="h6" weight="medium">
              Configure Card Amount
            </Text>
          </div>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-white rounded-lg border border-gray-200 p-6 space-y-6 max-w-2xl"
          >
            <Input
              label="Minimum Card Amount"
              type="number"
              step="1"
              placeholder="Enter minimum card amount"
              {...form.register('min_card_amount')}
              error={form.formState.errors.min_card_amount?.message}
            />

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                variant="secondary"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending
                  ? 'Updating...'
                  : 'Update Card Configuration'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

