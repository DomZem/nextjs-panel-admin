import { AutoTableBasicActionsWithRedirectDetailsColumn } from "../auto-table-row";
import { type ZodObjectInfer, type ZodObjectSchema } from "~/utils/zod";
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

export const AutoTableRedirectDetails = <
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
  detailsHref,
  children,
}: IAutoTableCrudProvider<TSchema, TCreateFormSchema, TUpdateFormSchema> &
  IAutoTableDataProvider<TSchema> & {
    children: React.ReactNode;
    detailsHref: (row: ZodObjectInfer<TSchema>) => string;
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
              <AutoTableBasicActionsWithRedirectDetailsColumn
                row={row.original}
                detailsHref={detailsHref}
              />
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
