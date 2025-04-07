import { useAutoTable } from "~/components/auto-table/providers/auto-table-provider";
import { type ZodObjectSchema } from "~/utils/zod";
import { toast } from "../use-toast";
import { type z } from "zod";

export interface IUseDeleteAutoTableData<TSchema extends ZodObjectSchema> {
  onDelete: (selectedRow: z.infer<TSchema>) => Promise<unknown>;
}

export const useDeleteAutoTableData = <TSchema extends ZodObjectSchema>({
  onDelete,
}: IUseDeleteAutoTableData<TSchema>) => {
  const { selectedRow, refetchData, setCurrentAction, currentAction } =
    useAutoTable<TSchema>();

  const handleClose = () => {
    setCurrentAction(null);
  };

  const handleDelete = async () => {
    try {
      if (!selectedRow) {
        throw new Error("no selected row to delete");
      }

      await onDelete(selectedRow);
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
