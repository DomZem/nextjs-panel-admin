import { AutoTableBasicActionsWithRedirectDetailsColumn } from "../auto-table-row";
import {
  type ZodDiscriminatedObjectSchema,
  type ZodObjectSchema,
} from "~/utils/zod";
import { mapDashedFieldName } from "~/utils/mappers";
import {
  AutoTableCrudProvider,
  type IAutoTableCrudProvider,
} from "../providers/auto-table-crud-provider";
import {
  AutoTableDataProvider,
  type IAutoTableDataProvider,
} from "../providers/auto-table-data-provider";
import { type z } from "zod";
import React from "react";

export const AutoTableRedirectDetails = <
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
  detailsHref,
  children,
}: IAutoTableCrudProvider<TSchema, TFormSchema> &
  IAutoTableDataProvider<TSchema> & {
    children: React.ReactNode;
    detailsHref: (row: z.infer<TSchema>) => string;
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
