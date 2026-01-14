import { StatusCell, EmailCell, DateCell } from '@/components';
import type { CsvHeader } from '@/types/shared';
import { InvitationActionCell } from './InvitationActionCell';
import { NullableTextCell } from './NullableTextCell';

export const invitationListColumns = [
  {
    header: 'Email',
    accessorKey: 'user_email',
    cell: EmailCell,
  },
  {
    header: 'Full Name',
    accessorKey: 'user_fullname',
    cell: NullableTextCell,
  },
  {
    header: 'Phone Number',
    accessorKey: 'user_phonenumber',
  },
  {
    header: 'Business Name',
    accessorKey: 'business_name',
    cell: NullableTextCell,
  },
  {
    header: 'Business Location',
    accessorKey: 'business_location',
    cell: NullableTextCell,
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: StatusCell,
  },
  {
    header: 'Created At',
    accessorKey: 'created_at',
    cell: DateCell,
  },
  {
    id: 'actions',
    header: '',
    accessorKey: '',
    cell: InvitationActionCell,
  },
];

export const invitationListCsvHeaders: Array<CsvHeader> = [
  {
    name: 'Email',
    accessor: 'user_email',
  },
  {
    name: 'Full Name',
    accessor: 'user_fullname',
  },
  {
    name: 'Phone Number',
    accessor: 'user_phonenumber',
  },
  {
    name: 'Business Name',
    accessor: 'business_name',
  },
  {
    name: 'Business Location',
    accessor: 'business_location',
  },
  {
    name: 'Status',
    accessor: 'status',
  },
  {
    name: 'Created At',
    accessor: 'created_at',
  },
];
