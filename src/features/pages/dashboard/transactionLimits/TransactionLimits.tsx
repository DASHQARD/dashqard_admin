import { useEffect } from 'react';
import { Button, Input, Text, Loader } from '@/components';
import { useCustomForm } from '@/libs';
import { transactionLimitsManagementQueries } from '@/features/hooks/transactionLimitsManagement';
import { transactionLimitsManagementMutations } from '@/features/hooks/transactionLimitsManagement';

export default function TransactionLimits() {
  const { useGetTransactionLimits } = transactionLimitsManagementQueries();
  const { data: transactionLimits, isLoading } = useGetTransactionLimits();
  const { useUpdateTransactionLimits } = transactionLimitsManagementMutations();
  const updateMutation = useUpdateTransactionLimits();

  const form = useCustomForm({
    defaultValues: {
      guest_amount_limit: '',
      user_amount_limit: '',
    },
  });

  useEffect(() => {
    if (transactionLimits) {
      // Extract only editable fields (exclude id, timestamps, updated_by)
      const editableFields = {
        guest_amount_limit: transactionLimits.guest_amount_limit || '',
        user_amount_limit: transactionLimits.user_amount_limit || '',
      };
      form.reset(editableFields);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionLimits]);

  const onSubmit = (data: any) => {
    updateMutation.mutate(data, {
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

  if (!transactionLimits) {
    return (
      <div className="lg:py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <Text variant="p">No transaction limits found</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:py-10">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <Text variant="h2" weight="semibold" className="text-primary-900">
            Transaction Limits
          </Text>
        </div>

        <div className="relative space-y-[37px]">
          <div className="text-[#0c4b77] py-2 border-b-2 border-[#0c4b77] w-fit">
            <Text variant="h6" weight="medium">
              Configure Transaction Limits
            </Text>
          </div>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-white rounded-lg border border-gray-200 p-6 space-y-6 max-w-2xl"
          >
            <Input
              label="Guest Amount Limit"
              type="number"
              step="0.01"
              placeholder="Enter guest amount limit"
              {...form.register('guest_amount_limit')}
              error={form.formState.errors.guest_amount_limit?.message}
            />

            <Input
              label="User Amount Limit"
              type="number"
              step="0.01"
              placeholder="Enter user amount limit"
              {...form.register('user_amount_limit')}
              error={form.formState.errors.user_amount_limit?.message}
            />

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                variant="secondary"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? 'Updating...' : 'Update Limits'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
