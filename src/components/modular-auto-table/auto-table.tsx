import { useAutoTableDetailsData } from "./auto-table-details-data-provider";
import { type ZodObjectInfer, type ZodObjectSchema } from "~/utils/zod";
import { type ActionType, useAutoTable } from "./auto-table-provider";
import { flexRender, type Row } from "@tanstack/react-table";
import { TableBody, TableCell, TableRow } from "../ui/table";
import { LoaderCircle, MoreHorizontal } from "lucide-react";
import {
  type IUseGetAutoTableDetailsData,
  useGetAutoTableDetailsData,
} from "~/hooks/auto-table/use-get-auto-table-details-data";
import { useDataTable } from "../ui/data-table";
import React, { useMemo } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export const AutoTableFullActionsColumn = <
  TSchema extends ZodObjectSchema,
  TDetailsData extends Record<string, unknown>,
>({
  row,
  onDetails,
}: {
  row: ZodObjectInfer<TSchema>;
} & IUseGetAutoTableDetailsData<TSchema, TDetailsData>) => {
  const { handleGetDetailsData } = useGetAutoTableDetailsData<
    TSchema,
    TDetailsData
  >({
    onDetails,
  });

  const { setCurrentAction, setSelectedRow } = useAutoTable<TSchema>();

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

export const AutoTableBasicActionsColumn = <TSchema extends ZodObjectSchema>({
  row,
}: {
  row: ZodObjectInfer<TSchema>;
}) => {
  const { setCurrentAction, setSelectedRow } = useAutoTable<TSchema>();

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

export const AutoTableBody = ({
  extraRow,
}: {
  extraRow?: (row: Row<unknown>) => React.ReactNode;
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
  const { detailsData, renderDetails } = useAutoTableDetailsData();
  const { selectedRow, currentAction } = useAutoTable();
  const { table } = useDataTable();

  const columnsLength = useMemo(() => table.getAllColumns().length, [table]);

  if (!selectedRow || currentAction !== "DETAILS") {
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
          renderDetails(detailsData)
        )}
      </TableCell>
    </TableRow>
  );
};
