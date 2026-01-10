import { useEffect } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Combobox, Input, Modal, Text } from '@/components';
import { Controller } from 'react-hook-form';
import { usePersistedModalState } from '@/hooks';
import { useCustomForm } from '@/libs';
import { MODALS } from '@/utils/constants';
import { vendorPaymentsManagementMutations } from '@/features/hooks/vendorPaymentsManagement';
import { z } from 'zod';

const updateVendorPaymentSchema = z.object({
  status: z.enum(['pending', 'paid', 'overdue']).optional(),
  paid_date: z.string().optional(),
  payment_amount: z.number().min(0, 'Amount must be 0 or greater').optional(),
  description: z.string().optional(),
  due_date: z.string().optional(),
  payment_period: z.string().optional(),
});

type UpdateVendorPaymentSchemaType = z.infer<typeof updateVendorPaymentSchema>;

type VendorPaymentData = {
  id: number | string;
  status?: string;
  paid_date?: string | null;
  payment_amount?: string | number;
  description?: string;
  due_date?: string;
  payment_period?: string;
};

export function UpdateVendorPayment() {
  const modal = usePersistedModalState<VendorPaymentData>({
    paramName: MODALS.VENDOR_PAYMENT_MANAGEMENT.PARAM_NAME,
  });

  const { useUpdateVendorPayment } = vendorPaymentsManagementMutations();
  const updatePaymentMutation = useUpdateVendorPayment();

  const form = useCustomForm({
    resolver: zodResolver(updateVendorPaymentSchema),
    defaultValues: {
      status: undefined as 'pending' | 'paid' | 'overdue' | undefined,
      paid_date: '',
      payment_amount: undefined as number | undefined,
      description: '',
      due_date: '',
      payment_period: '',
    },
  });

  useEffect(() => {
    if (modal.modalData) {
      const data = modal.modalData;
      
      // Helper to format date for datetime-local input (YYYY-MM-DDTHH:mm)
      const formatForDateTimeLocal = (dateString?: string | null): string => {
        if (!dateString) return '';
        try {
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return '';
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          return `${year}-${month}-${day}T${hours}:${minutes}`;
        } catch {
          return '';
        }
      };

      form.reset({
        status: (data.status as 'pending' | 'paid' | 'overdue') || undefined,
        paid_date: formatForDateTimeLocal(data.paid_date),
        payment_amount: data.payment_amount
          ? typeof data.payment_amount === 'string'
            ? parseFloat(data.payment_amount)
            : data.payment_amount
          : undefined,
        description: data.description || '',
        due_date: formatForDateTimeLocal(data.due_date),
        payment_period: data.payment_period || '',
      });
    }
  }, [modal.modalData, form]);

  const onSubmit: SubmitHandler<UpdateVendorPaymentSchemaType> = (data) => {
    if (!modal.modalData?.id) return;

    // Convert datetime-local format to ISO format for API
    const convertToISO = (dateTimeLocal: string): string => {
      if (!dateTimeLocal) return '';
      // datetime-local returns "YYYY-MM-DDTHH:mm", convert to ISO "YYYY-MM-DDTHH:mm:ss.sssZ"
      const date = new Date(dateTimeLocal);
      return date.toISOString();
    };

    // Only send fields that have values
    const updateData: any = {};
    if (data.status) updateData.status = data.status;
    if (data.paid_date) updateData.paid_date = convertToISO(data.paid_date);
    if (data.payment_amount !== undefined)
      updateData.payment_amount = data.payment_amount;
    if (data.description) updateData.description = data.description;
    if (data.due_date) updateData.due_date = convertToISO(data.due_date);
    if (data.payment_period) updateData.payment_period = data.payment_period;

    updatePaymentMutation.mutate(
      {
        id: String(modal.modalData.id),
        data: updateData,
      },
      {
        onSuccess: () => {
          modal.closeModal();
          form.reset();
        },
      }
    );
  };

  const statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Paid', value: 'paid' },
    { label: 'Overdue', value: 'overdue' },
  ];

  return (
    <Modal
      panelClass="!w-[680px]"
      title="Update Vendor Payment"
      isOpen={modal.isModalOpen(
        MODALS.VENDOR_PAYMENT_MANAGEMENT.CHILDREN.UPDATE
      )}
      setIsOpen={(isOpen) => {
        if (!isOpen) {
          modal.closeModal();
          form.reset();
        }
      }}
      position="side"
      showClose={true}
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col h-full"
      >
        <div className="h-full px-6 flex flex-col gap-6 justify-between">
          <div className="grow overflow-y-auto py-6">
            <div className="space-y-6">
              <Controller
                control={form.control}
                name="status"
                render={({ field }) => (
                  <Combobox
                    label="Status"
                    placeholder="Select status (optional)"
                    options={statusOptions}
                    value={field.value}
                    onChange={(option: { value: string } | null) => {
                      field.onChange(option?.value);
                    }}
                    error={form.formState.errors.status?.message}
                  />
                )}
              />

              <Controller
                control={form.control}
                name="payment_amount"
                render={({ field }) => (
                  <Input
                    label="Payment Amount"
                    type="number"
                    step="0.01"
                    placeholder="Enter amount (optional)"
                    value={field.value?.toString() || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value;
                      field.onChange(value ? parseFloat(value) : undefined);
                    }}
                    error={form.formState.errors.payment_amount?.message}
                  />
                )}
              />

              <Controller
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <Input
                    label="Due Date"
                    type="datetime-local"
                    placeholder="Select due date (optional)"
                    value={field.value || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      field.onChange(e.target.value);
                    }}
                    error={form.formState.errors.due_date?.message}
                  />
                )}
              />

              <Controller
                control={form.control}
                name="paid_date"
                render={({ field }) => (
                  <Input
                    label="Paid Date"
                    type="datetime-local"
                    placeholder="Select paid date (optional)"
                    value={field.value || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      field.onChange(e.target.value);
                    }}
                    error={form.formState.errors.paid_date?.message}
                  />
                )}
              />

              <Controller
                control={form.control}
                name="payment_period"
                render={({ field }) => (
                  <Input
                    label="Payment Period"
                    placeholder="Enter payment period (optional)"
                    value={field.value || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      field.onChange(e.target.value);
                    }}
                    error={form.formState.errors.payment_period?.message}
                  />
                )}
              />

              <Controller
                control={form.control}
                name="description"
                render={({ field }) => (
                  <div className="flex flex-col gap-2">
                    <Text variant="span" className="text-sm text-gray-700">
                      Description
                    </Text>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter description (optional)"
                      rows={4}
                      value={field.value || ''}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        field.onChange(e.target.value);
                      }}
                    />
                    {form.formState.errors.description && (
                      <Text variant="span" className="text-xs text-error">
                        {form.formState.errors.description.message}
                      </Text>
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          <div className="flex gap-4 justify-end pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                modal.closeModal();
                form.reset();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="secondary"
              disabled={updatePaymentMutation.isPending}
            >
              {updatePaymentMutation.isPending ? 'Updating...' : 'Update Payment'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

