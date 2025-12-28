import { Dropdown, StatusCell } from '@/components';
import { usePersistedModalState } from '@/hooks';
import { Icon } from '@/libs';
import type { CsvHeader, TableCellProps } from '@/types/shared';
import { MODALS } from '@/utils/constants';

export const countryListColumns = [
  {
    header: 'Name',
    accessorKey: 'name',
  },
  {
    header: 'Code',
    accessorKey: 'code',
  },
  {
    header: 'ISO Code',
    accessorKey: 'iso_code',
  },
  {
    header: 'Currency',
    accessorKey: 'currency',
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: StatusCell,
  },
  {
    id: 'actions',
    header: '',
    accessorKey: '',
    cell: CountryActionCell,
  },
];

export const countryListCsvHeaders: Array<CsvHeader> = [
  {
    name: 'Name',
    accessor: 'name',
  },
  {
    name: 'Code',
    accessor: 'code',
  },
  {
    name: 'ISO Code',
    accessor: 'iso_code',
  },
  {
    name: 'Currency',
    accessor: 'currency',
  },
  {
    name: 'Status',
    accessor: 'status',
  },
];

type CountryData = {
  id: number | string;
  code: string;
  iso_code: string;
  name: string;
  currency: string;
  status?: string;
};

export function CountryActionCell({ row }: TableCellProps<CountryData>) {
  const modal = usePersistedModalState<CountryData>({
    paramName: MODALS.COUNTRIES_MANAGEMENT.PARAM_NAME,
  });

  const countryData = (row.original || row) as CountryData;

  const actions = [
    {
      label: 'Edit',
      onClickFn: () => {
        modal.openModal(MODALS.COUNTRIES_MANAGEMENT.CHILDREN.EDIT, countryData);
      },
    },
    {
      label: 'Update Status',
      onClickFn: () => {
        modal.openModal(
          MODALS.COUNTRIES_MANAGEMENT.CHILDREN.UPDATE_STATUS,
          countryData
        );
      },
    },
    {
      label: 'Delete',
      onClickFn: () => {
        modal.openModal(
          MODALS.COUNTRIES_MANAGEMENT.CHILDREN.DELETE,
          countryData
        );
      },
      className: 'text-error',
    },
  ];

  return (
    <div className="flex justify-end">
      <Dropdown actions={actions}>
        <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">
          <Icon icon="bi:three-dots-vertical" className="w-5 h-5" />
        </div>
      </Dropdown>
    </div>
  );
}
