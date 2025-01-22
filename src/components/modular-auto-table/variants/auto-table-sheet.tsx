import { type IUseGetAutoTableDetailsData } from "~/hooks/auto-table/use-get-auto-table-details-data";
import { type IUseDeleteAutoTableData } from "~/hooks/auto-table/use-delete-auto-table";
import {
  AutoTableProvider,
  type AutoTableImplementationProps,
} from "../auto-table-provider";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { AutoTableDeleteDialog } from "../auto-table-delete-dialog";
import { AutoTableBody } from "~/components/auto-table/auto-table";
import { AutoTableActionsColumn } from "../auto-table";
import { mapDashedFieldName } from "~/utils/mappers";
import React, { type ComponentProps } from "react";
import { Button } from "~/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import {
  DataTable,
  DataTableHeader,
  DataTableProvider,
  DataTableSelectColumns,
} from "~/components/ui/data-table";
import {
  type ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
} from "@tanstack/react-table";
import {
  AutoTableCloseDetailsButton,
  AutoTableCreateButton,
  AutoTableHeader,
  AutoTableHeaderTitle,
  AutoTableRefreshButton,
} from "../auto-table-header";
import dayjs from "dayjs";
import {
  extractFieldNamesFromSchema,
  type ZodObjectInfer,
  type ZodObjectSchema,
} from "~/utils/zod";
import {
  AutoTableCreateFormSheet,
  AutoTableUpdateFormSheet,
} from "../auto-table-form";

export const AutoTableSheet = <
  TSchema extends ZodObjectSchema,
  TCreateFormSchema extends ZodObjectSchema,
  TUpdateFormSchema extends ZodObjectSchema,
  TDetailsData extends Record<string, unknown>,
>({
  title,
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
}: AutoTableImplementationProps<TSchema> &
  IUseDeleteAutoTableData<TSchema> &
  IUseGetAutoTableDetailsData<TSchema, TDetailsData> & {
    data: ZodObjectInfer<TSchema>[];
    omitColumns?: Partial<{
      [K in keyof ZodObjectInfer<TSchema>]: true;
    }>;
    extraColumns?: ColumnDef<ZodObjectInfer<TSchema>>[];
  } & {
    create: ComponentProps<typeof AutoTableCreateFormSheet<TCreateFormSchema>>;
  } & {
    update: ComponentProps<
      typeof AutoTableUpdateFormSheet<TUpdateFormSchema, TSchema, TDetailsData>
    >;
  } & {
    title: string;
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
          return dayjs(cellData as Date).format("DD MMMM YYYY");
        }

        return <div>{cellData}</div>;
      },
    }));

  const columns: ColumnDef<ZodObjectInfer<TSchema>>[] = [
    ...basicColumns,
    {
      header: "actions",
      cell: ({ row }) => (
        <AutoTableActionsColumn row={row.original} onDetails={onDetails} />
      ),
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
          <AutoTableHeader>
            <AutoTableHeaderTitle>{title}</AutoTableHeaderTitle>
            <div className="inline-flex items-center gap-3">
              <AutoTableRefreshButton />
              <DataTableSelectColumns mapColumnName={mapDashedFieldName} />
              <AutoTableCloseDetailsButton />
              <AutoTableCreateButton />
            </div>
          </AutoTableHeader>

          <ScrollArea className="flex-1">
            <DataTable>
              <DataTableHeader />
              <AutoTableBody />
            </DataTable>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </DataTableProvider>

        <AutoTableDeleteDialog onDelete={onDelete} />
        <AutoTableCreateFormSheet
          formSchema={create.formSchema}
          onCreate={create.onCreate}
          fieldsConfig={create.fieldsConfig}
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
