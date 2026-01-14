import { Tag } from '@/components';
import { getStatusVariant } from '@/utils';

export function VendorStatusCell({ getValue }: { getValue: () => string }) {
  const status = getValue();
  return (
    <>
      {status ? <Tag value={status} variant={getStatusVariant(status)} /> : '-'}
    </>
  );
}
