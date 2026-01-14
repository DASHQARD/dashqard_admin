import { StatusCell } from '@/components';
import type { CsvHeader } from '@/types/shared';
import { formatDate } from '@/utils';
import { CorporateActionCell } from './CorporateActionCell';

export const corporateListColumns = [
  {
    header: 'Corporate ID',
    accessorKey: 'corporate_id',
  },
  {
    header: 'Company Name',
    accessorKey: 'business_name',
  },

  {
    header: 'Location',
    accessorKey: 'business_address',
  },
  {
    header: 'Phone Number',
    accessorKey: 'phonenumber',
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
  },
  {
    name: 'Company Name',
    accessor: 'business_name',
  },

  {
    name: 'Location',
    accessor: 'business_address',
  },
  {
    name: 'Phone Number',
    accessor: 'phonenumber',
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
