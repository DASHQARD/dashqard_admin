import { formatDate } from '@/utils';

export function DateCell({ getValue }: Readonly<{ getValue: () => string }>) {
  return <div>{getValue() ? formatDate(getValue()) : '-'}</div>;
}
export function DateCellTimestamp({
  getValue,
}: Readonly<{ getValue: () => string }>) {
  return <div>{getValue() ? formatDate(getValue()) : '-'}</div>;
}
