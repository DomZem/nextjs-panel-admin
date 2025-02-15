import { type IUseDeleteAutoTableData } from "~/hooks/auto-table/use-delete-auto-table";
import { AutoTableDeleteDialog } from "../auto-table-delete-dialog";
import { DataTableProvider } from "~/components/ui/data-table";
import { AutoTableBasicActionsColumn } from "../auto-table";
import { mapDashedFieldName } from "~/utils/mappers";
import React, { type ComponentProps } from "react";
import { Button } from "~/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import {
  AutoTableProvider,
  type AutoTableImplementationProps,
} from "../auto-table-provider";
import {
  type ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
} from "@tanstack/react-table";
import {
  AutoTableCreateFormSheet,
  AutoTableUpdateFormSheet,
} from "../auto-table-form";
import dayjs from "dayjs";
import {
  extractFieldNamesFromSchema,
  type ZodObjectInfer,
  type ZodObjectSchema,
} from "~/utils/zod";

export const AutoTableSheet = <
  TSchema extends ZodObjectSchema,
  TCreateFormSchema extends ZodObjectSchema,
  TUpdateFormSchema extends ZodObjectSchema,
>({
  schema,
  rowIdentifierKey,
  onRefetchData,
  onDelete,
  data,
  extraColumns,
  create,
  update,
  omitColumns,
  columnsMap,
  children,
}: AutoTableImplementationProps<TSchema> &
  IUseDeleteAutoTableData<TSchema> & {
    data: ZodObjectInfer<TSchema>[];
    omitColumns?: Partial<{
      [K in keyof ZodObjectInfer<TSchema>]: true;
    }>;
    columnsMap?: Partial<{
      [K in keyof ZodObjectInfer<TSchema>]: (
        data: ZodObjectInfer<TSchema>[K],
      ) => React.ReactNode;
    }>;
    extraColumns?: ColumnDef<ZodObjectInfer<TSchema>>[];
    create: ComponentProps<typeof AutoTableCreateFormSheet<TCreateFormSchema>>;
    update: ComponentProps<
      typeof AutoTableUpdateFormSheet<TUpdateFormSchema, TSchema>
    >;
    children: React.ReactNode;
  }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const fieldNames = extractFieldNamesFromSchema(schema);

  const filteredFieldNames = omitColumns
    ? fieldNames.filter((fieldName) => !omitColumns[fieldName])
    : fieldNames;

  const basicColumns: ColumnDef<ZodObjectInfer<TSchema>>[] =
    filteredFieldNames.map((fieldName) => ({
      accessorKey: fieldName,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {mapDashedFieldName(fieldName as string)}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const cellData = row.original[fieldName];

        if (columnsMap && columnsMap[fieldName]) {
          return columnsMap[fieldName](cellData);
        }

        if (typeof cellData === "object" && dayjs(cellData as Date).isValid()) {
          return dayjs(cellData as Date).format("DD MMMM YYYY HH:mm");
        }

        return <>{cellData}</>;
      },
    }));

  const columns: ColumnDef<ZodObjectInfer<TSchema>>[] = [
    ...basicColumns,
    {
      header: "actions",
      cell: ({ row }) => <AutoTableBasicActionsColumn row={row.original} />,
    },
    ...(extraColumns ?? []),
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-hidden">
      <AutoTableProvider
        schema={schema}
        rowIdentifierKey={rowIdentifierKey}
        onRefetchData={onRefetchData}
      >
        <DataTableProvider
          tableOptions={{
            data,
            columns,
            getCoreRowModel: getCoreRowModel(),
            initialState: {
              columnOrder: ["id"],
            },
            onSortingChange: setSorting,
            getSortedRowModel: getSortedRowModel(),
            state: {
              sorting,
            },
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            getRowId: (row) => row[rowIdentifierKey],
          }}
        >
          {children}
        </DataTableProvider>

        <AutoTableDeleteDialog onDelete={onDelete} />

        <AutoTableCreateFormSheet
          formSchema={create.formSchema}
          onCreate={create.onCreate}
          fieldsConfig={create.fieldsConfig}
          defaultValues={create.defaultValues}
        />

        <AutoTableUpdateFormSheet
          formSchema={update.formSchema}
          onUpdate={update.onUpdate}
          fieldsConfig={update.fieldsConfig}
        />
      </AutoTableProvider>
    </div>
  );
};
