import { StatusCell } from '@/components';
import type { CsvHeader } from '@/types/shared';
import { CountryActionCell } from './CountryActionCell';

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
