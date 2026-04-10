import { getMethod, patchMethod } from '@/services';

const commonUrl = '/service-fees';

export type ServiceFeesPayload = {
  serviceFeeRate: number | null;
  vendorMarkupRate: number | null;
};

function pickNumber(
  source: Record<string, unknown> | null | undefined,
  camel: string,
  snake: string
): number | null {
  if (!source || typeof source !== 'object') return null;
  const raw = source[camel] ?? source[snake];
  if (raw === null || raw === undefined || raw === '') return null;
  const n = typeof raw === 'number' ? raw : Number(String(raw).trim());
  return Number.isFinite(n) ? n : null;
}

/**
 * Unwraps common API shapes (camelCase / snake_case, optional `data` wrapper)
 * so the Fees UI always receives stable numeric fields.
 */
export function normalizeServiceFeesResponse(body: unknown): ServiceFeesPayload {
  if (body === null || body === undefined) {
    return { serviceFeeRate: null, vendorMarkupRate: null };
  }

  const root = body as Record<string, unknown>;
  const inner =
    root.data !== undefined &&
    typeof root.data === 'object' &&
    root.data !== null &&
    !Array.isArray(root.data)
      ? (root.data as Record<string, unknown>)
      : root;

  return {
    serviceFeeRate: pickNumber(inner, 'serviceFeeRate', 'service_fee_rate'),
    vendorMarkupRate: pickNumber(
      inner,
      'vendorMarkupRate',
      'vendor_markup_rate'
    ),
  };
}

export const getServiceFees = async (): Promise<ServiceFeesPayload> => {
  const response = await getMethod<unknown>(commonUrl);
  return normalizeServiceFeesResponse(response);
};

export const updateServiceFees = async (data: {
  service_fee_rate: number;
  vendor_markup_rate: number;
}): Promise<any> => {
  return await patchMethod(commonUrl, data);
};
