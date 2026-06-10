import { StatusCell } from '@/components';
import type { CsvHeader } from '@/types/shared';
import { formatDate } from '@/utils';
import { CorporateActionCell } from './CorporateActionCell';
import { EmptyTextCell } from './EmptyTextCell';

export const corporateListColumns = [
  {
    header: 'Corporate ID',
    accessorKey: 'corporate_id',
    cell: EmptyTextCell,
  },
  {
    header: 'Company Name',
    accessorKey: 'business_name',
    cell: EmptyTextCell,
  },

  {
    header: 'Location',
    accessorKey: 'business_address',
    cell: EmptyTextCell,
  },
  {
    header: 'Phone Number',
    accessorKey: 'phonenumber',
    cell: EmptyTextCell,
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
    cell: CorporateActionCell,
  },
];

export const corporateListCsvHeaders: Array<CsvHeader> = [
  {
    name: 'Corporate ID',
    accessor: 'corporate_id',
    transform: (value) =>
      value == null || String(value).trim() === '' ? '--' : String(value),
  },
  {
    name: 'Company Name',
    accessor: 'business_name',
    transform: (value) =>
      value == null || String(value).trim() === '' ? '--' : String(value),
  },

  {
    name: 'Location',
    accessor: 'business_address',
    transform: (value) =>
      value == null || String(value).trim() === '' ? '--' : String(value),
  },
  {
    name: 'Phone Number',
    accessor: 'phonenumber',
    transform: (value) =>
      value == null || String(value).trim() === '' ? '--' : String(value),
  },
  {
    name: 'Date Created',
    accessor: 'created_at',
    transform: (value) => formatDate(value, 'DD MMM YYYY'),
  },
  {
    name: 'Status',
    accessor: 'status',
  },
];
