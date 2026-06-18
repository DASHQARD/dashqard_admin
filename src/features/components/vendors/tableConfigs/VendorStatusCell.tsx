import { Tag } from '@/components';
import { formatStatusLabel, getStatusVariant } from '@/utils';

export function VendorStatusCell({ getValue }: { getValue: () => string }) {
  const status = getValue();
  const label = formatStatusLabel(status);

  return <>{label ? <Tag value={label} variant={getStatusVariant(status)} /> : '-'}</>;
}
