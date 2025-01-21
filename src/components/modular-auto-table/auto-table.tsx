import { type ZodObjectInfer, type ZodObjectSchema } from "~/utils/zod";
import { type ActionType } from "../auto-table/auto-table-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  type IUseGetAutoTableDetailsData,
  useGetAutoTableDetailsData,
} from "~/hooks/auto-table/use-get-auto-table-details-data";
import { useAutoTable } from "./auto-table-provider";

export const AutoTableActionsColumn = <
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

  const { setCurrentAction, setSelectedRow } = useAutoTable<
    TSchema,
    TDetailsData
  >();

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
