import { type TableCellProps } from '@/types';
import { formatCurrency } from '@/utils';

export function CurrencyCell({ row }: TableCellProps) {
  const { amount } = row.original;
  return <span>{formatCurrency(amount, 'GHS')}</span>;
}
