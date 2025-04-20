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

export interface IAutoTableDataProvider<TSchema extends ZodObjectSchema> {
  data: z.infer<TSchema>[];
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

  const columns: ColumnDef<z.infer<TSchema>>[] = useMemo(
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
