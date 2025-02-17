import { DataTable, useDataTable } from "../../ui/data-table";
import { ScrollArea, ScrollBar } from "../../ui/scroll-area";
import { flexRender, type Row } from "@tanstack/react-table";
import React from "react";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";

export const AutoTableBasicTable = ({
  extraRow,
}: {
  extraRow?: (row: Row<unknown>) => React.ReactNode;
}) => {
  const { table } = useDataTable();

  const columnsLength = table.getAllColumns().length;

  return (
    <ScrollArea className="flex-1">
      <DataTable>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <React.Fragment key={row.id}>
                <TableRow data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
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
      </DataTable>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
