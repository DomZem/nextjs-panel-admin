import { useAutoTableColumnsOrder } from "~/hooks/auto-table/use-auto-table-columns-order";
import { extractFieldNamesFromSchema } from "~/utils/auto-form";
import { DataTableProvider } from "../../ui/data-table";
import { useAutoTable } from "./auto-table-provider";
import { type ZodObjectSchema } from "~/types/zod";
import { Badge } from "~/components/ui/badge";
import { useMemo, useState } from "react";
import {
  type ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
} from "@tanstack/react-table";
import { type z } from "zod";
import dayjs from "dayjs";
import { Checkbox } from "~/components/ui/checkbox";
import { AutoTableSelectCell } from "../auto-table-cell";

export interface IAutoTableDataProvider<TSchema extends ZodObjectSchema> {
  data: z.infer<TSchema>[];
  defaultVisibleColumns?: Partial<{
    [K in keyof z.infer<TSchema>]: true;
  }>;
  omitColumns?: Partial<{
    [K in keyof z.infer<TSchema>]: true;
  }>;
  columnsMap?: Partial<{
    [K in keyof z.infer<TSchema>]: (
      data: z.infer<TSchema>[K],
    ) => React.ReactNode;
  }>;
  extraColumns?: ColumnDef<z.infer<TSchema>>[];
  mapColumnName?: (columnName: string) => string;
}

export const AutoTableDataProvider = <TSchema extends ZodObjectSchema>({
  data,
  omitColumns,
  columnsMap,
  extraColumns,
  mapColumnName,
  defaultVisibleColumns,
  children,
}: IAutoTableDataProvider<TSchema> & {
  children: React.ReactNode;
}) => {
  const { schema, rowIdentifierKey, setSelectedRows } = useAutoTable<TSchema>();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const fieldNames = extractFieldNamesFromSchema(schema);

  const filteredFieldNames = useMemo(
    () =>
      omitColumns
        ? fieldNames.filter((fieldName) => !omitColumns[fieldName])
        : fieldNames,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const basicColumns: ColumnDef<z.infer<TSchema>>[] = useMemo(
    () =>
      filteredFieldNames.map((fieldName) => ({
        accessorKey: mapColumnName
          ? mapColumnName(fieldName as string)
          : fieldName,
        id: fieldName.toString(),

        cell: ({ row }) => {
          const cellData = row.original[fieldName];

          if (columnsMap && columnsMap[fieldName]) {
            return columnsMap[fieldName](cellData);
          }

          if (
            typeof cellData === "object" &&
            dayjs(cellData as Date).isValid()
          ) {
            return dayjs(cellData as Date).format("DD MMMM YYYY HH:mm");
          }

          if (typeof cellData === "boolean") {
            return (
              <Badge variant={cellData ? "success" : "destructive"}>
                {cellData ? "true" : "false"}
              </Badge>
            );
          }

          if (typeof cellData === undefined || cellData === null) {
            return "N/A";
          }

          return <>{cellData}</>;
        },
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const selectColumn: ColumnDef<z.infer<TSchema>> = useMemo(
    () => ({
      id: "select",
      size: 50,
      minSize: 50,
      maxSize: 50,
      header: ({ table }) => (
        <div className="flex w-full items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => {
              setSelectedRows(value ? table.getFilteredRowModel().rows : []);
              table.toggleAllPageRowsSelected(!!value);
            }}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => <AutoTableSelectCell row={row} />,
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
    }),
    [],
  );

  const columns: ColumnDef<z.infer<TSchema>>[] = useMemo(
    () => [selectColumn, ...basicColumns, ...(extraColumns ?? [])],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const { columnOrder, handleColumnOrderChange } = useAutoTableColumnsOrder({
    columns,
  });

  const visibleColumnKeys = Object.keys(defaultVisibleColumns ?? {});
  const hasDefaultVisibleColumns = visibleColumnKeys.length > 0;

  return (
    <DataTableProvider
      tableOptions={{
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        enableRowSelection: true,
        state: {
          sorting,
          columnOrder,
          rowSelection,
        },
        initialState: {
          columnVisibility: {
            ...Object.fromEntries(
              filteredFieldNames.map((fieldName) => {
                const value = hasDefaultVisibleColumns
                  ? !!defaultVisibleColumns?.[fieldName]
                  : true;

                return [fieldName, value];
              }),
            ),
          },
        },
        onSortingChange: setSorting,
        onColumnOrderChange: handleColumnOrderChange,
        onRowSelectionChange: setRowSelection,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        getRowId: (row) => row[rowIdentifierKey],
      }}
    >
      {children}
    </DataTableProvider>
  );
};
