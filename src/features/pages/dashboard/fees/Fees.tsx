import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Text, Loader } from '@/components';
import { useCustomForm } from '@/libs';
import { feesManagementQueries } from '@/features/hooks/feesManagement';
import { feesManagementMutations } from '@/features/hooks/feesManagement';
import { useContentGuard } from '@/hooks';

const feeFieldSchema = z
  .string()
  .trim()
  .min(1, 'Enter a rate')
  .refine((val) => !Number.isNaN(Number(val)), 'Must be a valid number')
  .refine((val) => Number(val) >= 0, 'Must be 0 or greater');

const feesFormSchema = z.object({
  service_fee_rate: feeFieldSchema,
  vendor_markup_rate: feeFieldSchema,
});

type FeesFormValues = z.infer<typeof feesFormSchema>;

function formatRateForInput(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '';
  }
  return String(value);
}

export default function Fees() {
  const { useGetServiceFees } = feesManagementQueries();
  const { data: serviceFees, isLoading, isError } = useGetServiceFees();
  const { useUpdateServiceFees } = feesManagementMutations();
  const updateMutation = useUpdateServiceFees();
  const { isAllowed: canManageFees } = useContentGuard('fees:manage');

  const form = useCustomForm<FeesFormValues>({
    resolver: zodResolver(feesFormSchema),
    defaultValues: {
      service_fee_rate: '',
      vendor_markup_rate: '',
    },
  });

  useEffect(() => {
    if (serviceFees) {
      form.reset({
        service_fee_rate: formatRateForInput(serviceFees.serviceFeeRate),
        vendor_markup_rate: formatRateForInput(serviceFees.vendorMarkupRate),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceFees]);

  const onSubmit = (data: FeesFormValues) => {
    const payload = {
      service_fee_rate: Number(data.service_fee_rate),
      vendor_markup_rate: Number(data.vendor_markup_rate),
    };
    updateMutation.mutate(payload, {
      onSuccess: () => {
        form.reset({
          service_fee_rate: formatRateForInput(payload.service_fee_rate),
          vendor_markup_rate: formatRateForInput(payload.vendor_markup_rate),
        });
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

  if (isError || serviceFees == null) {
    return (
      <div className="lg:py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <Text variant="p">
            {isError
              ? 'Could not load service fees configuration.'
              : 'No service fees configuration found.'}
          </Text>
        </div>
      </div>
    );
  }

  const readOnly = !canManageFees;

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

          {readOnly ? (
            <Text variant="span" className="text-gray-600 text-sm block">
              You have view-only access. An administrator with{' '}
              <code className="text-xs bg-gray-100 px-1 rounded">
                fees:manage
              </code>{' '}
              can change these rates.
            </Text>
          ) : null}

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-white rounded-lg border border-gray-200 p-6 space-y-6 max-w-2xl"
          >
            <Text variant="span" className="text-gray-600 text-sm block -mt-2">
              Enter each rate as a percentage (for example, <strong>2.5</strong>{' '}
              for 2.5%). Values are not capped in the admin app—use the range
              your policy and API allow.
            </Text>

            <Input
              label="Service fee rate"
              type="number"
              step="any"
              min={0}
              placeholder="e.g. 1 for 1%"
              readOnly={readOnly}
              disabled={readOnly}
              suffix={
                <span className="text-sm font-medium text-gray-600 shrink-0">
                  %
                </span>
              }
              {...form.register('service_fee_rate')}
              error={form.formState.errors.service_fee_rate?.message}
            />

            <Input
              label="Vendor markup rate"
              type="number"
              step="any"
              min={0}
              placeholder="e.g. 0.1 for 0.1%"
              readOnly={readOnly}
              disabled={readOnly}
              suffix={
                <span className="text-sm font-medium text-gray-600 shrink-0">
                  %
                </span>
              }
              {...form.register('vendor_markup_rate')}
              error={form.formState.errors.vendor_markup_rate?.message}
            />

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                variant="secondary"
                disabled={readOnly || updateMutation.isPending}
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
