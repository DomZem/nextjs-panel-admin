import { useAutoTableDetailsData } from "./providers/auto-table-details-data-provider";
import { type ActionType, useAutoTable } from "./providers/auto-table-provider";
import { type ZodObjectSchema } from "~/types/zod";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { type z } from "zod";
import React from "react";
import type { Row } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import type { CheckedState } from "@radix-ui/react-checkbox";

export const AutoTableFullActionsCell = <TSchema extends ZodObjectSchema>({
  row,
}: {
  row: Row<z.infer<TSchema>>;
}) => {
  const { getDetailsData } = useAutoTableDetailsData();

  const { setCurrentAction, setSelectedRow } = useAutoTable<TSchema>();

  const setAction = (action: ActionType) => {
    setSelectedRow(row.original);
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
            setSelectedRow(row.original);
            setCurrentAction("DETAILS");
            await getDetailsData(row.original);
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

export const AutoTableSelectCell = <TSchema extends ZodObjectSchema>({
  row,
}: {
  row: Row<z.infer<TSchema>>;
}) => {
  const { selectedRows, setSelectedRows } = useAutoTable<TSchema>();

  const handleCheckboxChange = (checked: CheckedState) => {
    if (!!checked) {
      setSelectedRows([...selectedRows, row.original]);
    } else {
      setSelectedRows(selectedRows.filter((r) => r !== row.original));
    }

    row.toggleSelected(!!checked);
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={handleCheckboxChange}
        aria-label="Select row"
      />
    </div>
  );
};
