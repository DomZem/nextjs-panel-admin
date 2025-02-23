"use client";

import { AutoTableDndTable } from "~/components/auto-table/tables/auto-table-dnd-table";
import { AutoTablePrimary } from "~/components/auto-table/variants/auto-table-primary";
import { AutoTableToolbarHeader } from "~/components/auto-table/auto-table-header";
import { AutoTableDetailsRow } from "~/components/auto-table/auto-table";
import { RegionCountriesTable } from "./region-countries-table";
import {
  regionCreateSchema,
  regionSchema,
  regionUpdateSchema,
} from "~/common/validations/region/region";
import { api } from "~/trpc/react";

export const RegionsTable = () => {
  const getAllRegions = api.region.getAll.useQuery();
  const deleteRegion = api.region.deleteOne.useMutation();
  const createRegion = api.region.createOne.useMutation();
  const updateRegion = api.region.updateOne.useMutation();
  const getRegionDetails = api.region.getOne.useMutation();

  return (
    <div className="flex flex-1 flex-col justify-between gap-4 overflow-hidden">
      <AutoTablePrimary
        technicalTableName="regions"
        schema={regionSchema}
        rowIdentifierKey="id"
        data={getAllRegions.data ?? []}
        onRefetchData={getAllRegions.refetch}
        onDetails={async (row) =>
          await getRegionDetails.mutateAsync({
            id: row.id,
          })
        }
        onDelete={async (row) => await deleteRegion.mutateAsync({ id: row.id })}
        renderDetails={(region) => {
          return (
            <div className="space-y-4">
              <RegionCountriesTable regionId={region.id} />
            </div>
          );
        }}
        create={{
          formSchema: regionCreateSchema,
          onCreate: createRegion.mutateAsync,
        }}
        update={{
          formSchema: regionUpdateSchema,
          onUpdate: updateRegion.mutateAsync,
          fieldsConfig: {
            id: {
              hidden: true,
            },
          },
        }}
      >
        <AutoTableToolbarHeader title="Regions" />

        <AutoTableDndTable
          extraRow={(row) => <AutoTableDetailsRow rowId={row.id} />}
        />
      </AutoTablePrimary>
    </div>
  );
};
