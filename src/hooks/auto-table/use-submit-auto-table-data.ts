import { useAutoTable } from "~/components/auto-table/providers/auto-table-provider";
import { type ZodObjectSchema } from "~/types/zod";
import { toast } from "../use-toast";

export const useSubmitAutoTableData = <TSchema extends ZodObjectSchema>() => {
  const { currentAction, setCurrentAction, refetchData } =
    useAutoTable<TSchema>();

  const handleSubmitData = async (callback: () => Promise<unknown>) => {
    try {
      await callback();
      await refetchData();

      toast({
        title: "Success",
        description: `The data has been ${currentAction === "CREATE" ? "created" : "updated"} successfully`,
      });

      setCurrentAction(null);
    } catch (e) {
      console.error(e);

      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  };

  return {
    handleSubmitData,
  };
};
