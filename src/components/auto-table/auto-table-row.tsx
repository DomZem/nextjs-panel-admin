import { useAutoTableDetailsData } from "./providers/auto-table-details-data-provider";
import { type ActionType, useAutoTable } from "./providers/auto-table-provider";
import { type ZodObjectInfer, type ZodObjectSchema } from "~/utils/zod";
import { LoaderCircle, MoreHorizontal } from "lucide-react";
import { TableCell, TableRow } from "../ui/table";
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
import Link from "next/link";

export const AutoTableFullActionsColumn = <TSchema extends ZodObjectSchema>({
  row,
}: {
  row: ZodObjectInfer<TSchema>;
}) => {
  const { getDetailsData } = useAutoTableDetailsData();

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
            await getDetailsData(row);
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

export const AutoTableBasicActionsWithRedirectDetailsColumn = <
  TSchema extends ZodObjectSchema,
>({
  row,
  detailsHref,
}: {
  row: ZodObjectInfer<TSchema>;
  detailsHref: (row: ZodObjectInfer<TSchema>) => string;
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
        <DropdownMenuItem asChild>
          <Link href={detailsHref(row)}>Details</Link>
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
      <TableCell className="py-4" colSpan={columnsLength}>
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
