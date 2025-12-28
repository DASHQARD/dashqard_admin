import { useEffect } from 'react';
import { Button, Input, Text, Loader } from '@/components';
import { useCustomForm } from '@/libs';
import { feesManagementQueries } from '@/features/hooks/feesManagement';
import { feesManagementMutations } from '@/features/hooks/feesManagement';

export default function Fees() {
  const { useGetServiceFees } = feesManagementQueries();
  const { data: serviceFees, isLoading } = useGetServiceFees();
  const { useUpdateServiceFees } = feesManagementMutations();
  const updateMutation = useUpdateServiceFees();

  const form = useCustomForm({
    defaultValues: {
      service_fee_rate: '',
      vendor_markup_rate: '',
    },
  });

  useEffect(() => {
    if (serviceFees) {
      // Extract only editable fields (API returns camelCase, we map to snake_case for form)
      const editableFields = {
        service_fee_rate: serviceFees.serviceFeeRate || '',
        vendor_markup_rate: serviceFees.vendorMarkupRate || '',
      };
      form.reset(editableFields);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceFees]);

  const onSubmit = (data: any) => {
    // Convert string values to numbers and map to API expected format (snake_case)
    const payload = {
      service_fee_rate: Number(data.service_fee_rate),
      vendor_markup_rate: Number(data.vendor_markup_rate),
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

  if (!serviceFees) {
    return (
      <div className="lg:py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <Text variant="p">No service fees configuration found</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:py-10">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <Text variant="h2" weight="semibold" className="text-primary-900">
            Service Fees Configuration
          </Text>
        </div>

        <div className="relative space-y-[37px]">
          <div className="text-[#0c4b77] py-2 border-b-2 border-[#0c4b77] w-fit">
            <Text variant="h6" weight="medium">
              Configure Service Fees
            </Text>
          </div>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-white rounded-lg border border-gray-200 p-6 space-y-6 max-w-2xl"
          >
            <Input
              label="Service Fee Rate"
              type="number"
              step="0.01"
              placeholder="Enter service fee rate"
              {...form.register('service_fee_rate')}
              error={form.formState.errors.service_fee_rate?.message}
            />

            <Input
              label="Vendor Markup Rate"
              type="number"
              step="0.01"
              placeholder="Enter vendor markup rate"
              {...form.register('vendor_markup_rate')}
              error={form.formState.errors.vendor_markup_rate?.message}
            />

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                variant="secondary"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? 'Updating...' : 'Update Fees'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
