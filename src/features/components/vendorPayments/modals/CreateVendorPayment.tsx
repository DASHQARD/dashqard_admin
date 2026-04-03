import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Combobox, Input, Modal, Text } from '@/components';
import { Controller } from 'react-hook-form';
import { usePersistedModalState } from '@/hooks';
import { useCustomForm } from '@/libs';
import { MODALS } from '@/utils/constants';
import { vendorManagementQueries } from '@/features/hooks/vendorManagement';
import {
  vendorPaymentsManagementMutations,
  vendorPaymentsManagementQueries,
} from '@/features/hooks/vendorPaymentsManagement';
import { z } from 'zod';

const createVendorPaymentSchema = z.object({
  vendor_id: z.number().min(1, 'Select a vendor'),
  vendor_user_id: z.number().min(1, 'Vendor user ID is required'),
  payment_frequency: z.enum(['daily', 'weekly', 'bi-weekly', 'monthly']),
  branch_location: z.string().min(1, 'Branch location is required'),
  branch_id: z.number().min(1, 'Branch ID is required'),
  payment_amount: z.coerce.number().positive('Amount must be greater than 0'),
  payment_period: z.string().min(1, 'Payment period is required'),
  due_date: z.string().min(1, 'Due date is required'),
  description: z.string().min(1, 'Description is required'),
});

type CreateVendorPaymentForm = z.infer<typeof createVendorPaymentSchema>;

const FREQUENCY_OPTIONS = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Bi-weekly', value: 'bi-weekly' },
  { label: 'Monthly', value: 'monthly' },
];

function toIsoFromDateTimeLocal(value: string): string {
  if (!value) return new Date().toISOString();
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

/** Combobox passes react-select shape `{ target: { value, name } }`, not a raw string */
function comboboxNumericValue(e: { target?: { value?: unknown } }): number {
  const raw = e?.target?.value;
  if (raw === '' || raw == null || raw === undefined) return 0;
  const n = typeof raw === 'number' ? raw : Number(raw);
  return Number.isFinite(n) ? n : 0;
}

function comboboxStringValue(e: { target?: { value?: unknown } }): string {
  const raw = e?.target?.value;
  return raw == null ? '' : String(raw);
}

type BranchRow = {
  branch_id: number;
  branch_location: string;
  label: string;
};

function normalizeBranchesResponse(res: unknown): unknown[] {
  if (!res) return [];
  const r = res as { data?: unknown[] };
  if (Array.isArray(r?.data)) return r.data;
  if (Array.isArray(res)) return res;
  return [];
}

function branchesFromVendorDetails(vd: unknown): BranchRow[] {
  if (!vd || typeof vd !== 'object') return [];
  const raw = (vd as Record<string, unknown>).branches;
  if (!Array.isArray(raw)) return [];
  return raw
    .map((b: unknown) => {
      const row = b as Record<string, unknown>;
      const bid = Number(row.branch_id ?? row.id);
      const loc = String(
        row.branch_location ?? row.location ?? row.name ?? row.branch_name ?? ''
      ).trim();
      if (!Number.isFinite(bid) || bid <= 0) return null;
      return {
        branch_id: bid,
        branch_location: loc || `Branch ${bid}`,
        label: loc ? `${loc} (ID: ${bid})` : `Branch ${bid}`,
      };
    })
    .filter(Boolean) as BranchRow[];
}

function mapApiBranchRows(rows: unknown[], vendorId: number): BranchRow[] {
  return rows
    .map((row: unknown) => {
      const r = row as Record<string, unknown>;
      if (
        vendorId > 0 &&
        r.vendor_id != null &&
        Number(r.vendor_id) !== vendorId
      ) {
        return null;
      }
      const bid = Number(r.branch_id ?? r.id);
      const loc = String(
        r.branch_location ?? r.location ?? r.name ?? ''
      ).trim();
      if (!Number.isFinite(bid) || bid <= 0) return null;
      return {
        branch_id: bid,
        branch_location: loc || `Branch ${bid}`,
        label: loc ? `${loc} (ID: ${bid})` : `Branch ${bid}`,
      };
    })
    .filter(Boolean) as BranchRow[];
}

export function CreateVendorPayment() {
  const modal = usePersistedModalState({
    paramName: MODALS.VENDOR_PAYMENT_MANAGEMENT.PARAM_NAME,
  });

  const isOpen = modal.isModalOpen(
    MODALS.VENDOR_PAYMENT_MANAGEMENT.CHILDREN.ADD_RECORD
  );

  const { useCreateVendorPayment } = vendorPaymentsManagementMutations();
  const createMutation = useCreateVendorPayment();

  const { useGetVendors, useGetVendorDetails } = vendorManagementQueries();
  const { useGetVendorPaymentBranches } = vendorPaymentsManagementQueries();
  const [vendorSearch, setVendorSearch] = React.useState('');

  const { data: vendorsResponse } = useGetVendors(
    { limit: 40, search: vendorSearch.trim() || undefined },
    { enabled: isOpen }
  );

  const form = useCustomForm<CreateVendorPaymentForm>({
    resolver: zodResolver(createVendorPaymentSchema),
    defaultValues: {
      vendor_id: 0,
      vendor_user_id: 0,
      payment_frequency: 'daily',
      branch_location: '',
      branch_id: 0,
      payment_amount: 0,
      payment_period: '',
      due_date: '',
      description: '',
    },
  });

  const vendorId = form.watch('vendor_id');
  const vendorUserId = form.watch('vendor_user_id');

  const { data: vendorDetailsResponse } = useGetVendorDetails(
    vendorId > 0 ? String(vendorId) : '',
    { enabled: isOpen && vendorId > 0 }
  );

  const vendorDetails = React.useMemo(() => {
    if (!vendorDetailsResponse) return null;
    return (
      (vendorDetailsResponse as { data?: unknown }).data ??
      vendorDetailsResponse
    );
  }, [vendorDetailsResponse]);

  const { data: branchesApiResponse, isLoading: isLoadingBranches } =
    useGetVendorPaymentBranches(
      {
        limit: 100,
        ...(vendorId > 0 ? { vendor_id: vendorId } : {}),
        ...(vendorUserId > 0 ? { vendor_user_id: vendorUserId } : {}),
      },
      {
        enabled: isOpen && vendorId > 0 && vendorUserId > 0,
      }
    );

  const branchRows = React.useMemo(() => {
    const rawList = normalizeBranchesResponse(branchesApiResponse);
    const fromApi = mapApiBranchRows(rawList, vendorId);
    const fromDetails = branchesFromVendorDetails(vendorDetails);
    if (fromApi.length > 0) return fromApi;
    if (fromDetails.length > 0) return fromDetails;
    return [];
  }, [branchesApiResponse, vendorDetails, vendorId]);

  const branchOptions = React.useMemo(
    () =>
      branchRows.map((b) => ({
        label: b.label,
        value: String(b.branch_id),
      })),
    [branchRows]
  );

  React.useEffect(() => {
    if (!isOpen || !vendorDetails || typeof vendorDetails !== 'object') return;
    const v = vendorDetails as Record<string, unknown>;
    const uid = v.vendor_user_id ?? v.user_id;
    if (uid != null && Number(uid) > 0) {
      form.setValue('vendor_user_id', Number(uid));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- form methods stable enough; avoid loop with form object
  }, [isOpen, vendorDetails]);

  const vendorOptions = React.useMemo(() => {
    const raw = vendorsResponse as { data?: unknown[] } | unknown[] | undefined;
    const list = Array.isArray(raw)
      ? raw
      : Array.isArray((raw as { data?: unknown[] })?.data)
        ? (raw as { data: unknown[] }).data
        : [];
    return list
      .map((item: unknown) => {
        const row = item as Record<string, unknown>;
        const id = row.id ?? row.vendor_id;
        if (id == null || id === '') return null;
        const name =
          (row.vendor_name as string) ||
          (row.business_name as string) ||
          `Vendor ${id}`;
        const gvid = (row.vendor_gvid as string) || '';
        return {
          label: gvid ? `${name} (${gvid})` : String(name),
          value: String(id),
        };
      })
      .filter(Boolean) as { label: string; value: string }[];
  }, [vendorsResponse]);

  React.useEffect(() => {
    if (!isOpen) return;
    form.setValue('vendor_user_id', 0);
    form.setValue('branch_id', 0);
    form.setValue('branch_location', '');
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `form` identity is unstable from useCustomForm
  }, [isOpen, vendorId]);

  const resetForm = React.useCallback(() => {
    form.reset({
      vendor_id: 0,
      vendor_user_id: 0,
      payment_frequency: 'daily',
      branch_location: '',
      branch_id: 0,
      payment_amount: 0,
      payment_period: '',
      due_date: '',
      description: '',
    });
    setVendorSearch('');
  }, [form]);

  const wasOpenRef = React.useRef(false);
  React.useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      resetForm();
      setVendorSearch('');
    }
    wasOpenRef.current = isOpen;
  }, [isOpen, resetForm]);

  const onSubmit: SubmitHandler<CreateVendorPaymentForm> = (data) => {
    createMutation.mutate(
      {
        vendor_id: data.vendor_id,
        vendor_user_id: data.vendor_user_id,
        payment_frequency: data.payment_frequency,
        branch_location: data.branch_location.trim(),
        branch_id: data.branch_id,
        payment_amount: data.payment_amount,
        payment_period: data.payment_period.trim(),
        due_date: toIsoFromDateTimeLocal(data.due_date),
        description: data.description.trim(),
      },
      {
        onSuccess: () => {
          modal.closeModal();
          resetForm();
        },
      }
    );
  };

  const handleSetIsOpen = React.useCallback(
    (next: boolean) => {
      if (!next) {
        modal.closeModal();
        resetForm();
      }
    },
    [modal, resetForm]
  );

  if (!isOpen) return null;

  return (
    <Modal
      panelClass="!w-[640px] max-w-[95vw]"
      title="Create vendor payment"
      isOpen={isOpen}
      setIsOpen={handleSetIsOpen}
      position="side"
      showClose={true}
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col h-full"
      >
        <div className="h-full px-6 flex flex-col gap-6 justify-between">
          <div className="grow overflow-y-auto py-6 space-y-5">
            <Text variant="span" className="text-sm text-gray-600">
              Create a new payment record with due date and branch details. The
              invoice number is generated by the system.
            </Text>

            <Input
              label="Search vendors"
              placeholder="Type to filter by name"
              value={vendorSearch}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setVendorSearch(e.target.value)
              }
            />

            <Controller
              control={form.control}
              name="vendor_id"
              render={({ field }) => (
                <Combobox
                  label="Vendor"
                  placeholder="Select vendor"
                  options={vendorOptions}
                  value={field.value > 0 ? String(field.value) : ''}
                  onChange={(e: { target?: { value?: unknown } }) => {
                    const n = comboboxNumericValue(e);
                    field.onChange(n > 0 ? n : 0);
                  }}
                  error={form.formState.errors.vendor_id?.message}
                />
              )}
            />

            <Controller
              control={form.control}
              name="payment_frequency"
              render={({ field }) => (
                <Combobox
                  label="Payment frequency"
                  options={FREQUENCY_OPTIONS}
                  value={field.value}
                  onChange={(e: { target?: { value?: unknown } }) => {
                    field.onChange(comboboxStringValue(e) || 'daily');
                  }}
                  error={form.formState.errors.payment_frequency?.message}
                />
              )}
            />

            {vendorId === 0 ? (
              <Text variant="span" className="text-sm text-gray-500">
                Select a vendor to load branches.
              </Text>
            ) : (
              <>
                {isLoadingBranches && branchRows.length === 0 ? (
                  <Text variant="span" className="text-sm text-gray-500">
                    Loading branches…
                  </Text>
                ) : null}

                {branchOptions.length > 0 ? (
                  <Controller
                    control={form.control}
                    name="branch_id"
                    render={({ field }) => (
                      <Combobox
                        label="Branch"
                        placeholder="Select branch"
                        options={branchOptions}
                        value={field.value > 0 ? String(field.value) : ''}
                        onChange={(e: { target?: { value?: unknown } }) => {
                          const id = comboboxNumericValue(e);
                          field.onChange(id > 0 ? id : 0);
                          const row = branchRows.find(
                            (b) => b.branch_id === id
                          );
                          form.setValue(
                            'branch_location',
                            row?.branch_location ?? ''
                          );
                        }}
                        error={
                          (form.formState.errors.branch_id?.message ||
                            form.formState.errors.branch_location?.message) as
                            | string
                            | undefined
                        }
                      />
                    )}
                  />
                ) : !isLoadingBranches ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Controller
                      control={form.control}
                      name="branch_id"
                      render={({ field }) => (
                        <Input
                          label="Branch ID"
                          type="number"
                          placeholder="Branch ID"
                          value={field.value > 0 ? String(field.value) : ''}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            const v = e.target.value;
                            field.onChange(v ? parseInt(v, 10) : 0);
                          }}
                          error={form.formState.errors.branch_id?.message}
                        />
                      )}
                    />
                    <Controller
                      control={form.control}
                      name="branch_location"
                      render={({ field }) => (
                        <Input
                          label="Branch location"
                          placeholder="e.g. Barnyard - Awoshie"
                          value={field.value}
                          onChange={field.onChange}
                          error={form.formState.errors.branch_location?.message}
                        />
                      )}
                    />
                    <Text
                      variant="span"
                      className="sm:col-span-2 text-xs text-gray-500"
                    >
                      No branch list returned for this vendor. Enter branch ID
                      and location manually.
                    </Text>
                  </div>
                ) : null}
              </>
            )}

            <Controller
              control={form.control}
              name="payment_amount"
              render={({ field }) => (
                <Input
                  label="Payment amount (GHS)"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={field.value > 0 ? String(field.value) : ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const v = e.target.value;
                    field.onChange(v ? parseFloat(v) : 0);
                  }}
                  error={form.formState.errors.payment_amount?.message}
                />
              )}
            />

            <Controller
              control={form.control}
              name="payment_period"
              render={({ field }) => (
                <Input
                  label="Payment period"
                  placeholder="e.g. 2026-01 or period label"
                  value={field.value}
                  onChange={field.onChange}
                  error={form.formState.errors.payment_period?.message}
                />
              )}
            />

            <Controller
              control={form.control}
              name="due_date"
              render={({ field }) => (
                <Input
                  label="Due date"
                  type="datetime-local"
                  value={field.value}
                  onChange={field.onChange}
                  error={form.formState.errors.due_date?.message}
                />
              )}
            />

            <Controller
              control={form.control}
              name="description"
              render={({ field }) => (
                <Input
                  label="Description"
                  type="textarea"
                  rows={4}
                  placeholder="What this payment is for"
                  value={field.value}
                  onChange={field.onChange}
                  error={form.formState.errors.description?.message}
                />
              )}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 pb-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                modal.closeModal();
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={createMutation.isPending}
              disabled={createMutation.isPending}
            >
              Create payment
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
