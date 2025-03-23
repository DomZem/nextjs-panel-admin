"use client";

import { AutoTableBasicActions } from "~/components/auto-table/variants/auto-table-basic-actions";
import { AutoTableDndTable } from "~/components/auto-table/tables/auto-table-dnd-table";
import {
  regionCountrySchema,
  regionCountryCreateSchema,
  regionCountryUpdateSchema,
} from "~/common/validations/region/region-country";
import {
  AutoTableContainer,
  AutoTableToolbarHeader,
} from "~/components/auto-table/auto-table-header";
import ReactCountryFlag from "react-country-flag";
import { LoaderCircle } from "lucide-react";
import { api } from "~/trpc/react";

export const RegionCountriesTable = ({ regionId }: { regionId: number }) => {
  const getAllRegionCountries = api.regionCountry.getAll.useQuery({
    regionId,
  });
  const createRegionCountry = api.regionCountry.createOne.useMutation();
  const updateRegionCountry = api.regionCountry.updateOne.useMutation();
  const deleteRegionCountry = api.regionCountry.deleteOne.useMutation();

  if (!getAllRegionCountries.data) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  return (
    <AutoTableContainer>
      <AutoTableBasicActions
        technicalTableName="region-countries"
        schema={regionCountrySchema}
        rowIdentifierKey="id"
        data={getAllRegionCountries.data}
        omitColumns={{
          region_id: true,
        }}
        columnsMap={{
          iso_2_code: (value) => {
            return (
              <div className="inline-flex items-center gap-2">
                <ReactCountryFlag countryCode={value} />
                <p>{value}</p>
              </div>
            );
          },
        }}
        onRefetchData={getAllRegionCountries.refetch}
        onDelete={async (selectedRow) =>
          await deleteRegionCountry.mutateAsync({
            id: selectedRow.id,
          })
        }
        create={{
          formSchema: regionCountryCreateSchema,
          onCreate: createRegionCountry.mutateAsync,
          fieldsConfig: {
            region_id: {
              hidden: true,
            },
          },
          defaultValues: {
            region_id: regionId,
          },
        }}
        update={{
          formSchema: regionCountryUpdateSchema,
          onUpdate: updateRegionCountry.mutateAsync,
          fieldsConfig: {
            id: {
              hidden: true,
            },
            region_id: {
              hidden: true,
            },
          },
        }}
      >
        <AutoTableToolbarHeader title="Countries" />

        <AutoTableDndTable />
      </AutoTableBasicActions>
    </AutoTableContainer>
  );
};
