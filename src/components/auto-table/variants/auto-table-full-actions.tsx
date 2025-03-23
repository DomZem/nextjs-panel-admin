import { AutoTableFullActionsColumn } from "../auto-table";
import {
  AutoTableDetailsDataProvider,
  type IAutoTableDetailsDataProvider,
} from "../providers/auto-table-details-data-provider";
import { mapDashedFieldName } from "~/utils/mappers";
import { type ZodObjectSchema } from "~/utils/zod";
import {
  AutoTableCrudProvider,
  type IAutoTableCrudProvider,
} from "../providers/auto-table-crud-provider";
import {
  AutoTableDataProvider,
  type IAutoTableDataProvider,
} from "../providers/auto-table-data-provider";
import React from "react";

export const AutoTableFullActions = <
  TSchema extends ZodObjectSchema,
  TCreateFormSchema extends ZodObjectSchema,
  TUpdateFormSchema extends ZodObjectSchema,
  TDetailsData extends Record<string, unknown>,
>({
  schema,
  technicalTableName,
  rowIdentifierKey,
  update,
  create,
  onDelete,
  onRefetchData,
  onDetails,
  renderDetails,
  data,
  columnsMap,
  extraColumns,
  omitColumns,
  mapColumnName,
  children,
}: IAutoTableCrudProvider<TSchema, TCreateFormSchema, TUpdateFormSchema> &
  IAutoTableDataProvider<TSchema> &
  IAutoTableDetailsDataProvider<TSchema, TDetailsData> & {
    children: React.ReactNode;
  }) => {
  return (
    <AutoTableCrudProvider
      schema={schema}
      technicalTableName={technicalTableName}
      rowIdentifierKey={rowIdentifierKey}
      onRefetchData={onRefetchData}
      onDelete={onDelete}
      create={create}
      update={update}
    >
      <AutoTableDetailsDataProvider
        onDetails={onDetails}
        renderDetails={renderDetails}
      >
        <AutoTableDataProvider
          data={data}
          omitColumns={omitColumns}
          columnsMap={columnsMap}
          mapColumnName={mapColumnName ?? mapDashedFieldName}
          extraColumns={[
            {
              id: "actions",
              header: "actions",
              cell: ({ row }) => (
                <AutoTableFullActionsColumn row={row.original} />
              ),
            },
            ...(extraColumns ?? []),
          ]}
        >
          {children}
        </AutoTableDataProvider>
      </AutoTableDetailsDataProvider>
    </AutoTableCrudProvider>
  );
};
