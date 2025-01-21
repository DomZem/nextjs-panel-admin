import { useAutoTable } from "~/components/modular-auto-table/auto-table-provider";
import { type ZodObjectSchema } from "~/utils/zod";
import { toast } from "../use-toast";

export const useSubmitAutoTableData = <
  TSchema extends ZodObjectSchema,
  TDetailsData extends Record<string, unknown>,
>() => {
  const { currentAction, setCurrentAction, refetchData } = useAutoTable<
    TSchema,
    TDetailsData
  >();

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
