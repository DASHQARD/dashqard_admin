import { Button, PaginatedTable, Text } from '@/components';
import { useCountriesManagementBase } from '@/features/hooks/countriesManagement';
import { usePersistedModalState } from '@/hooks';
import { MODALS } from '@/utils/constants';
import {
  countryListColumns,
  countryListCsvHeaders,
  CreateCountry,
  EditCountry,
  DeleteCountry,
  UpdateCountryStatus,
} from '@/features/components/countries';

export default function Countries() {
  const { query, setQuery, countriesList, isLoadingCountries } =
    useCountriesManagementBase();

  const modal = usePersistedModalState({
    paramName: MODALS.COUNTRIES_MANAGEMENT.PARAM_NAME,
  });

  return (
    <>
      <div className="lg:py-10">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <Text variant="h2" weight="semibold" className="text-primary-900">
              Countries Management
            </Text>
            <Button
              variant="secondary"
              onClick={() =>
                modal.openModal(MODALS.COUNTRIES_MANAGEMENT.CHILDREN.CREATE)
              }
            >
              Create Country
            </Button>
          </div>
          <div className="relative space-y-[37px]">
            <div className="text-[#0c4b77] py-2 border-b-2 border-[#0c4b77] w-fit">
              <Text variant="h6" weight="medium">
                All Countries
              </Text>
            </div>
            <PaginatedTable
              filterWrapperClassName="lg:absolute lg:top-0 lg:right-[2px]"
              columns={countryListColumns}
              data={countriesList || []}
              total={countriesList?.length || 0}
              loading={isLoadingCountries}
              query={query}
              setQuery={setQuery}
              searchPlaceholder="Search by country name, code, or currency..."
              csvHeaders={countryListCsvHeaders}
              printTitle="Countries"
              hasNextPage={false}
              hasPreviousPage={false}
              currentAfter={
                (query as any).after ? String((query as any).after) : undefined
              }
              previousCursor={null}
              onNextPage={() => {
                // Pagination will be implemented when hook supports it
              }}
              onPreviousPage={() => {
                // Pagination will be implemented when hook supports it
              }}
              onSetAfter={(afterParam: string) => {
                // Pagination will be implemented when hook supports it
                const queryWithAfter = query as any;
                if (afterParam) {
                  setQuery({ ...query, after: afterParam } as any);
                } else {
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const { after, ...rest } = queryWithAfter;
                  setQuery(rest);
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateCountry />
      <EditCountry />
      <DeleteCountry />
      <UpdateCountryStatus />
    </>
  );
}
