import type { GiftCardMetricDetail } from '@/types/cards';

function normalizeMetricsCardType(type?: string | null): string {
  return type?.trim().toLowerCase() ?? '';
}

function isBalanceCardType(type?: string | null): boolean {
  const normalized = normalizeMetricsCardType(type);
  return normalized === 'dashpro' || normalized === 'dashgo';
}

function isCountCardType(type?: string | null): boolean {
  const normalized = normalizeMetricsCardType(type);
  return normalized === 'dashx' || normalized === 'dashpass';
}

export function formatGiftCardMetricsBalance(row: GiftCardMetricDetail): string {
  if (isCountCardType(row.type)) return '—';
  if (isBalanceCardType(row.type)) {
    if (!row.unredeemed_amount?.trim()) return '—';
    return `${row.currency || 'GHS'} ${row.unredeemed_amount}`;
  }
  if (row.unredeemed_amount?.trim()) {
    return `${row.currency || 'GHS'} ${row.unredeemed_amount}`;
  }
  return '—';
}
