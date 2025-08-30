import {
  AutoTableDetailsDataProvider,
  type IAutoTableDetailsDataProvider,
} from "../providers/auto-table-details-data-provider";
import { mapDashedFieldName } from "~/utils/mappers";
import {
  AutoTableCrudProvider,
  type IAutoTableCrudProvider,
} from "../providers/auto-table-crud-provider";
import {
  AutoTableDataProvider,
  type IAutoTableDataProvider,
} from "../providers/auto-table-data-provider";
import React from "react";
import {
  type ZodDiscriminatedObjectSchema,
  type ZodObjectSchema,
} from "~/types/zod";
import { AutoTableFullActionsCell } from "../auto-table-cell";

export const AutoTableFullActions = <
  TSchema extends ZodObjectSchema,
  TFormSchema extends ZodObjectSchema | ZodDiscriminatedObjectSchema,
  TDetailsData extends Record<string, unknown>,
>({
  schema,
  technicalTableName,
  rowIdentifierKey,
  autoForm,
  onDelete,
  onRefetchData,
  details,
  data,
  columnsMap,
  extraColumns,
  omitColumns,
  defaultVisibleColumns,
  mapColumnName,
  children,
}: IAutoTableCrudProvider<TSchema, TFormSchema> &
  IAutoTableDataProvider<TSchema> & {
    details: IAutoTableDetailsDataProvider<TSchema, TDetailsData>;
    children: React.ReactNode;
  }) => {
  return (
    <AutoTableCrudProvider
      schema={schema}
      technicalTableName={technicalTableName}
      rowIdentifierKey={rowIdentifierKey}
      onRefetchData={onRefetchData}
      onDelete={onDelete}
      autoForm={autoForm}
    >
      <AutoTableDetailsDataProvider {...details}>
        <AutoTableDataProvider
          data={data}
          omitColumns={omitColumns}
          columnsMap={columnsMap}
          defaultVisibleColumns={defaultVisibleColumns}
          mapColumnName={mapColumnName ?? mapDashedFieldName}
          extraColumns={[
            {
              id: "actions",
              header: "actions",
              cell: ({ row }) => <AutoTableFullActionsCell row={row} />,
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
