import { type IUseGetAutoTableDetailsData } from "~/hooks/auto-table/use-get-auto-table-details-data";
import { type IUseDeleteAutoTableData } from "~/hooks/auto-table/use-delete-auto-table";
import { AutoTableDetailsDataProvider } from "../auto-table-details-data-provider";
import { AutoTableDeleteDialog } from "../auto-table-delete-dialog";
import { DataTableProvider } from "~/components/ui/data-table";
import { AutoTableFullActionsColumn } from "../auto-table";
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

export const AutoTableSheetProvider = <
  TSchema extends ZodObjectSchema,
  TCreateFormSchema extends ZodObjectSchema,
  TUpdateFormSchema extends ZodObjectSchema,
  TDetailsData extends Record<string, unknown>,
>({
  schema,
  rowIdentifierKey,
  onRefetchData,
  onDelete,
  onDetails,
  data,
  extraColumns,
  create,
  update,
  omitColumns,
  renderDetails,
  children,
}: AutoTableImplementationProps<TSchema> &
  IUseDeleteAutoTableData<TSchema> &
  IUseGetAutoTableDetailsData<TSchema, TDetailsData> & {
    children: React.ReactNode;
    data: ZodObjectInfer<TSchema>[];
    omitColumns?: Partial<{
      [K in keyof ZodObjectInfer<TSchema>]: true;
    }>;
    extraColumns?: ColumnDef<ZodObjectInfer<TSchema>>[];
    create: ComponentProps<typeof AutoTableCreateFormSheet<TCreateFormSchema>>;
    update: ComponentProps<
      typeof AutoTableUpdateFormSheet<TUpdateFormSchema, TSchema>
    >;
    renderDetails: (data: TDetailsData) => React.ReactNode;
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

        if (typeof cellData === "object" && dayjs(cellData as Date).isValid()) {
          return dayjs(cellData as Date).format("DD MMMM YYYY HH:mm");
        }

        return <div>{cellData}</div>;
      },
    }));

  const columns: ColumnDef<ZodObjectInfer<TSchema>>[] = [
    ...basicColumns,
    ...(extraColumns ?? []),
    {
      header: "actions",
      cell: ({ row }) => (
        <AutoTableFullActionsColumn row={row.original} onDetails={onDetails} />
      ),
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-hidden">
      <AutoTableProvider
        schema={schema}
        rowIdentifierKey={rowIdentifierKey}
        onRefetchData={onRefetchData}
      >
        <AutoTableDetailsDataProvider renderDetails={renderDetails}>
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
        </AutoTableDetailsDataProvider>

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
