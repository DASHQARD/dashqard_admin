import React from 'react';

import { type ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';

import EmptyStateImage from '@/assets/images/empty-state.png';
import { cn } from '@/libs';
import type { CsvHeader, DropdownOption, QueryType } from '@/types';
import { generateAndDownloadCsv, getQueryString } from '@/utils/helpers';

import { Button } from '../Button';
import { DateRangeFilter } from '../DateInput';
import { Dropdown } from '../Dropdown';
import { EmptyState } from '../EmptyState';
import { Loader } from '../Loader';
import { Pagination } from '../Pagination';
import { PrintView } from '../PrintView';
import { DebouncedSearch } from '../SearchBox';
import { Text } from '../Text';
import { Table } from './Table';

type DateOmits = 'page' | 'limit' | 'search';
type FilterType = {
  simpleSelects?: Array<{
    label: string;
    options: string[] | DropdownOption[];
  }>;
  date?:
    | Array<keyof Omit<QueryType, DateOmits>>
    | Array<{ queryKey: keyof Omit<QueryType, DateOmits>; label?: string }>;
};

type Props = Readonly<{
  columns: ColumnDef<any, any>[];
  data?: Record<string, any>[];
  loading: boolean;
  total?: number;
  query: QueryType;
  setQuery: React.Dispatch<QueryType>;
  searchPlaceholder?: string;
  className?: string;
  buttonGroup?: React.ReactNode;
  printTitle?: string;
  csvHeaders?: CsvHeader[];
  filterBy?: FilterType;
  noSearch?: boolean;
  noExport?: boolean;
  onRowClick?: (rowData: Record<string, any>) => void;
  filterWrapperClassName?: string;
  enableRowSelection?: boolean;
  getRowId?: (row: any) => string;
  rowSelection?: Record<string, boolean>;
  onRowSelectionChange?: (
    updater:
      | Record<string, boolean>
      | ((old: Record<string, boolean>) => Record<string, boolean>)
  ) => void;
  onNextPage?: () => void;
  onPreviousPage?: () => void;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  // For cursor-based pagination
  currentAfter?: string;
  previousCursor?: string | null;
  onSetAfter?: (after: string) => void;
  /**
   * When set, CSV/PDF export fetches this many rows from page 1 (cursor cleared)
   * so the file matches the full filtered list, not just the current page.
   * Omit to keep legacy behavior: export uses `total` (often current page size only).
   */
  exportFetchLimit?: number;
}>;

// Helper to remove page from query object
const removePageFromQuery = (query: QueryType): Omit<QueryType, 'page'> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { page, ...queryWithoutPage } = query as QueryType & { page?: number };
  return queryWithoutPage;
};

export function PaginatedTable({
  data,
  loading,
  total,
  columns,
  query,
  setQuery,
  searchPlaceholder,
  className,
  buttonGroup,
  printTitle,
  csvHeaders,
  filterBy,
  noSearch,
  noExport,
  onRowClick,
  filterWrapperClassName,
  enableRowSelection,
  getRowId,
  rowSelection,
  onRowSelectionChange,
  onNextPage,
  onPreviousPage,
  hasNextPage,
  hasPreviousPage,
  currentAfter,
  previousCursor,
  onSetAfter,
  exportFetchLimit,
}: Props) {
  const shouldShowPagination =
    typeof hasNextPage === 'boolean' && typeof hasPreviousPage === 'boolean'
      ? hasNextPage || hasPreviousPage
      : true;

  const memoisedColumns = React.useMemo(() => columns, [columns]);
  const memoisedData = React.useMemo(() => data ?? [], [data]);

  // Get date filter config to determine query keys
  const dateFilterConfig = React.useMemo(() => {
    if (!filterBy?.date || filterBy.date.length === 0) return null;

    const config = filterBy.date.find((dateFilter) => {
      const dateConfig =
        typeof dateFilter === 'string' ? { queryKey: dateFilter } : dateFilter;
      const key = dateConfig.queryKey as string;
      return key === 'date_from' || key === 'date_to' || key === 'date';
    });

    if (!config) return null;

    return typeof config === 'string'
      ? { queryKey: config, label: 'Date range' }
      : config;
  }, [filterBy]);

  const startDate = React.useMemo(() => {
    const start = query.date_from;
    if (!start) return null;
    const parsed = dayjs(start);
    return parsed.isValid() ? parsed.toDate() : null;
  }, [query.date_from]);

  const endDate = React.useMemo(() => {
    const end = query.date_to;
    if (!end) return null;
    const parsed = dayjs(end);
    return parsed.isValid() ? parsed.toDate() : null;
  }, [query.date_to]);

  const handleDateRangeChange = React.useCallback(
    (dates: [Date | null, Date | null]) => {
      const [start, end] = dates;
      const queryWithoutPage = removePageFromQuery(query);
      setQuery({
        ...queryWithoutPage,
        page: 1,
        after: '',
        date_from: start ? dayjs(start).format('YYYY-MM-DD') : '',
        date_to: end ? dayjs(end).format('YYYY-MM-DD') : '',
      } as QueryType);
    },
    [query, setQuery]
  );

  const [exportPending, setExportPending] = React.useState<
    'csv' | 'pdf' | null
  >(null);

  const exportRequestedLimitRef = React.useRef<number | null>(null);
  const exportRestoreQueryRef = React.useRef<{
    limit: number;
    after?: string;
  } | null>(null);

  const beginExport = React.useCallback(
    (kind: 'csv' | 'pdf') => {
      const rowCountOnPage = Number(total) || 0;
      const fullListExport = exportFetchLimit != null;
      const targetLimit = fullListExport
        ? Math.max(1, exportFetchLimit)
        : Math.max(1, rowCountOnPage || 1);

      exportRequestedLimitRef.current = targetLimit;
      const q = query as QueryType & { after?: string };
      exportRestoreQueryRef.current = {
        limit: Number(query.limit) || 10,
        after:
          q.after != null && String(q.after).length > 0
            ? String(q.after)
            : undefined,
      };

      setExportPending(kind);
      const queryWithoutPage = removePageFromQuery(query);
      const next = {
        ...queryWithoutPage,
        limit: targetLimit,
        ...(fullListExport ? { after: '' } : {}),
      } as QueryType;
      setQuery(next);
    },
    [exportFetchLimit, query, setQuery, total]
  );

  const actions = [
    ...(csvHeaders
      ? [
          {
            label: 'Export as CSV',
            onClickFn: () => beginExport('csv'),
          },
        ]
      : []),
    {
      label: 'Export as PDF',
      onClickFn: () => beginExport('pdf'),
    },
  ];

  // Watch for data changes and export when ready
  React.useEffect(() => {
    const requested = exportRequestedLimitRef.current;
    if (
      !exportPending ||
      loading ||
      requested === null ||
      Number(query.limit) !== requested
    ) {
      return;
    }

    const rows = data ?? [];

    if (exportPending === 'csv' && csvHeaders) {
      const queryWithoutPage = removePageFromQuery(query);
      generateAndDownloadCsv({
        data: rows,
        fileName:
          printTitle ??
          `Afri-transfer${printTitle ?? ''}-${getQueryString(queryWithoutPage)}`,
        headers: csvHeaders,
      });
    } else if (exportPending === 'pdf') {
      globalThis.print();
    }

    exportRequestedLimitRef.current = null;

    const restore = exportRestoreQueryRef.current;
    exportRestoreQueryRef.current = null;
    if (restore) {
      const queryWithoutPage = removePageFromQuery(query);
      setQuery({
        ...queryWithoutPage,
        limit: restore.limit,
        after: restore.after ?? '',
      } as QueryType);
    }

    setExportPending(null);
  }, [data, exportPending, loading, query, printTitle, csvHeaders, setQuery]);

  return (
    <div className={cn('grid gap-4', className)}>
      <div
        className={`relative z-10 flex flex-wrap justify-end items-center gap-2 ${filterWrapperClassName ?? ''}`}
      >
        {noSearch ? null : (
          <DebouncedSearch
            value={query.search}
            onChange={(value) => {
              const queryWithoutPage = removePageFromQuery(query);
              setQuery({ ...queryWithoutPage, search: value } as QueryType);
            }}
            placeholder={searchPlaceholder ?? 'Search...'}
            className="md:w-[343px]"
          />
        )}
        {filterBy?.simpleSelects?.map((item) => {
          const selectedValue = query[item.label as keyof QueryType];
          const selectedOption = item.options.find(
            (x) => (typeof x === 'string' ? x : x.value) === selectedValue
          );
          const displayText =
            selectedValue && selectedOption
              ? typeof selectedOption === 'string'
                ? selectedOption
                : selectedOption.label
              : `Filter by ${item.label === 'direction' ? 'transaction type' : item.label}`;

          return (
            <Dropdown
              key={item.label}
              contentClassName=""
              align="start"
              actions={[
                {
                  label: 'All',
                  value: '',
                },
                ...item.options.map((x) =>
                  typeof x === 'string' ? { label: x, value: x } : x
                ),
              ].map((option) => ({
                label: option.label,
                onClickFn: () => {
                  const queryWithoutPage = removePageFromQuery(query);
                  setQuery({
                    ...queryWithoutPage,
                    [item.label]: option.value,
                  } as QueryType);
                },
              }))}
            >
              <Button
                variant="outline"
                icon="hugeicons:arrow-down-01"
                iconPosition="right"
                size="medium"
                className="border border-[#e2e4ed] bg-white py-0 rounded-md w-fit text-xs text-[#7c8689] font-normal capitalize"
              >
                {displayText}
              </Button>
            </Dropdown>
          );
        })}

        {/* Date range filters */}
        {dateFilterConfig && (
          <DateRangeFilter
            key="date-range-filter"
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateRangeChange}
            placeholder={dateFilterConfig.label || 'Date range'}
            format="DD-MM-YYYY"
          />
        )}

        {/* other filters here */}
        {buttonGroup}

        {noExport ? null : (
          <div className="">
            <Dropdown actions={actions}>
              <Button
                variant="outline"
                icon="hugeicons:arrow-down-01"
                iconPosition="right"
                size="medium"
                className="border border-[#e2e4ed] bg-white py-0 rounded-md w-fit text-xs text-primary-900 capitalize font-semibold "
              >
                Export
              </Button>
            </Dropdown>
          </div>
        )}
      </div>

      {loading ? (
        <div className="w-full h-80 grid place-items-center">
          <div className="w-full">
            <Loader />
          </div>
        </div>
      ) : (
        <PrintView>
          <div className="overflow-x-auto">
            <Text weight="bold" className="print-view mb-5">
              {printTitle}
            </Text>
            <Table
              columns={memoisedColumns as any}
              data={memoisedData}
              onRowClick={onRowClick}
              enableRowSelection={enableRowSelection}
              getRowId={getRowId}
              rowSelection={rowSelection}
              onRowSelectionChange={onRowSelectionChange}
            />

            {memoisedData?.length ? null : (
              <EmptyState
                image={EmptyStateImage}
                title="Nothing here yet"
                description="Once data is added or actions are taken, you'll see them appear in this space."
              />
            )}

            {shouldShowPagination ? (
              <div className="no-print mt-5">
                <Pagination
                  total={Number(total)}
                  limit={Number(query.limit)}
                  onNextPage={onNextPage}
                  onPreviousPage={onPreviousPage}
                  hasNextPage={hasNextPage}
                  hasPreviousPage={hasPreviousPage}
                  currentAfter={currentAfter}
                  previousCursor={previousCursor}
                  onSetAfter={onSetAfter}
                />
              </div>
            ) : null}
          </div>
        </PrintView>
      )}
    </div>
  );
}
