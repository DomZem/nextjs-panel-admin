import { useAutoTable } from "~/components/modular-auto-table/auto-table-provider";
import {
  type StringOrNumberKeyOnly,
  type ZodObjectInfer,
  type ZodObjectSchema,
} from "~/utils/zod";
import { toast } from "../use-toast";

export interface IUseDeleteAutoTableData<TSchema extends ZodObjectSchema> {
  onDelete: ({
    id,
  }: {
    id: StringOrNumberKeyOnly<ZodObjectInfer<TSchema>>;
  }) => Promise<unknown>;
}

export const useDeleteAutoTableData = <
  TSchema extends ZodObjectSchema,
  TDetailsData extends Record<string, unknown>,
>({
  onDelete,
}: IUseDeleteAutoTableData<TSchema>) => {
  const {
    selectedRow,
    refetchData,
    setCurrentAction,
    rowIdentifierKey,
    currentAction,
  } = useAutoTable<TSchema, TDetailsData>();

  const handleClose = () => {
    setCurrentAction(null);
  };

  const handleDelete = async () => {
    if (!selectedRow) {
      throw new Error("No selected row to delete");
    }

    try {
      const id = selectedRow[rowIdentifierKey];
      await onDelete({ id });
      await refetchData();

      toast({
        title: "Success",
        description: "The data has been deleted successfully",
      });
    } catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    } finally {
      setCurrentAction(null);
    }
  };

  return {
    isDeleteActionActive: currentAction === "DELETE",
    handleDelete,
    handleClose,
  };
};
