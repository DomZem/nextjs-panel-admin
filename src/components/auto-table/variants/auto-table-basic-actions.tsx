import { AutoTableBasicActionsColumn } from "../auto-table-row";
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

export const AutoTableBasicActions = <
  TSchema extends ZodObjectSchema,
  TFormSchema extends ZodObjectSchema | ZodDiscriminatedObjectSchema,
>({
  schema,
  technicalTableName,
  rowIdentifierKey,
  autoForm,
  onDelete,
  onRefetchData,
  data,
  columnsMap,
  extraColumns,
  omitColumns,
  mapColumnName,
  children,
}: IAutoTableCrudProvider<TSchema, TFormSchema> &
  IAutoTableDataProvider<TSchema> & {
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
              <AutoTableBasicActionsColumn row={row.original} />
            ),
          },
          ...(extraColumns ?? []),
        ]}
      >
        {children}
      </AutoTableDataProvider>
    </AutoTableCrudProvider>
  );
};
