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
import Link from "next/link";
import { type z } from "zod";
import React from "react";

export const AutoTableFullActionsColumn = <TSchema extends ZodObjectSchema>({
  row,
}: {
  row: z.infer<TSchema>;
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
  row: z.infer<TSchema>;
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
  row: z.infer<TSchema>;
  detailsHref: (row: z.infer<TSchema>) => string;
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
