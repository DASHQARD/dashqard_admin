import { CustomIcon, Dropdown } from '@/components';
import type { TableCellProps } from '@/types';

export function ActionCell({ row }: TableCellProps<{ id: string }>) {
  // TODO: Implement when customer management actions are ready
  // const { getSavingsOptions } = useCustomersManagementBase();
  // Use row.original to access the row data when implementing actions
  console.log('row', row);

  return (
    <Dropdown actions={[]}>
      <button
        type="button"
        className="btn rounded-lg no-print"
        aria-label="View actions"
      >
        <CustomIcon name="MoreVertical" width={24} height={24} />
      </button>
    </Dropdown>
  );
}
