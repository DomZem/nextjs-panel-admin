"use client";

import React, { useMemo } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type Row,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowUpDown, LoaderCircle, MoreHorizontal } from "lucide-react";
import dayjs from "dayjs";
import { type ActionType, useAutoTable } from "./auto-table-context";
import {
  extractFieldNamesFromSchema,
  type ZodObjectInfer,
  type ZodObjectSchema,
} from "~/utils/zod";
import { Button } from "../ui/button";
import { mapDashedFieldName } from "~/utils/mappers";
import { DataTableProvider, useDataTable } from "../ui/data-table";
import { TableBody, TableCell, TableRow } from "../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export const AutoTableSortDataProvider = <TSchema extends ZodObjectSchema>({
  schema,
  data,
  children,
  omitColumns,
  extraColumns,
}: {
  schema: TSchema;
  data: ZodObjectInfer<TSchema>[];
  children: React.ReactNode;
  omitColumns?: Partial<{
    [K in keyof ZodObjectInfer<TSchema>]: true;
  }>;
  extraColumns?: ColumnDef<ZodObjectInfer<TSchema>>[];
}) => {
  const { schema: autoTableSchema, rowIdentifierKey } = useAutoTable();
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // TODO: implement this
  // check if the autoTableSchema is the same as the schema passed in
  // if not, throw an error

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

  const columns = [...basicColumns, ...(extraColumns ?? [])];

  return (
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
        getRowId: (row) => row[rowIdentifierKey],
      }}
    >
      {children}
    </DataTableProvider>
  );
};

export const AutoTableBody = ({
  extraRow,
}: {
  extraRow?: (row: Row<any>) => React.ReactNode;
}) => {
  const { table } = useDataTable();
  const columnsLength = table.getAllColumns().length;

  return (
    <TableBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <React.Fragment key={row.id}>
            <TableRow data-state={row.getIsSelected() && "selected"}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
            {extraRow?.(row)}
          </React.Fragment>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columnsLength} className="h-24 text-center">
            No results.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};

export const AutoTableDetailsRow = ({ rowId }: { rowId: string | number }) => {
  const { table } = useDataTable();
  const columnsLength = useMemo(() => table.getAllColumns().length, [table]);

  const { selectedRow, detailsData, detailsContent } = useAutoTable();

  if (!selectedRow) {
    return null;
  }

  if (selectedRow.id !== rowId) {
    return null;
  }

  return (
    <TableRow className="relative w-screen" data-state="selected">
      <TableCell colSpan={columnsLength}>
        {!detailsData ? (
          <div className="flex h-96 items-center justify-center">
            <LoaderCircle className="animate-spin" />
          </div>
        ) : (
          detailsContent(detailsData)
        )}
      </TableCell>
    </TableRow>
  );
};

export const AutoTableActionsColumn = ({
  row,
}: {
  row: ZodObjectInfer<ZodObjectSchema>;
}) => {
  const { setCurrentAction, setSelectedRow, handleGetDetailsData } =
    useAutoTable();

  // TODO: Check if the provided row is the same structure as the row from context
  // if not, throw an error

  const setAction = (action: ActionType) => {
    setSelectedRow(row);
    setCurrentAction(action);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={async () => {
            setSelectedRow(row);
            setCurrentAction("DETAILS");
            await handleGetDetailsData(row.id);
          }}
        >
          Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setAction("UPDATE")}>
          Update
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setAction("DELETE")}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
