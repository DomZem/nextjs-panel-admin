import { AutoTableBasicActionsColumn } from "../auto-table";
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

export const AutoTableBasicActions = <
  TSchema extends ZodObjectSchema,
  TCreateFormSchema extends ZodObjectSchema,
  TUpdateFormSchema extends ZodObjectSchema,
>({
  schema,
  technicalTableName,
  rowIdentifierKey,
  update,
  create,
  onDelete,
  onRefetchData,
  data,
  columnsMap,
  extraColumns,
  omitColumns,
  children,
}: IAutoTableCrudProvider<TSchema, TCreateFormSchema, TUpdateFormSchema> &
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
      create={create}
      update={update}
    >
      <AutoTableDataProvider
        data={data}
        omitColumns={omitColumns}
        columnsMap={columnsMap}
        mapColumnName={mapDashedFieldName}
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
