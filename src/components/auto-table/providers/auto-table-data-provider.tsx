import { useAutoTableColumnsOrder } from "~/hooks/auto-table/use-auto-table-columns-order";
import { DataTableProvider } from "../../ui/data-table";
import { useAutoTable } from "./auto-table-provider";
import { Badge } from "~/components/ui/badge";
import { useMemo, useState } from "react";
import {
  type ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import {
  extractFieldNamesFromSchema,
  type ZodObjectInfer,
  type ZodObjectSchema,
} from "~/utils/zod";

export interface IAutoTableDataProvider<TSchema extends ZodObjectSchema> {
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
}

export const AutoTableDataProvider = <TSchema extends ZodObjectSchema>({
  data,
  omitColumns,
  columnsMap,
  extraColumns,
  children,
}: IAutoTableDataProvider<TSchema> & {
  children: React.ReactNode;
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const { schema, rowIdentifierKey } = useAutoTable<TSchema>();

  const fieldNames = extractFieldNamesFromSchema(schema);

  const filteredFieldNames = useMemo(
    () =>
      omitColumns
        ? fieldNames.filter((fieldName) => !omitColumns[fieldName])
        : fieldNames,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const basicColumns: ColumnDef<ZodObjectInfer<TSchema>>[] = useMemo(
    () =>
      filteredFieldNames.map((fieldName) => ({
        accessorKey: fieldName,
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

  const columns: ColumnDef<ZodObjectInfer<TSchema>>[] = useMemo(
    () => [...basicColumns, ...(extraColumns ?? [])],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const { columnOrder, handleColumnOrderChange } = useAutoTableColumnsOrder({
    columns,
  });

  return (
    <DataTableProvider
      tableOptions={{
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
          sorting,
          columnOrder,
        },
        onSortingChange: setSorting,
        onColumnOrderChange: handleColumnOrderChange,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        getRowId: (row) => row[rowIdentifierKey],
      }}
    >
      {children}
    </DataTableProvider>
  );
};
