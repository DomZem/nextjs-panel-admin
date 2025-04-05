import { useAutoTable } from "~/components/auto-table/providers/auto-table-provider";
import { useSubmitAutoTableData } from "./use-submit-auto-table-data";
import { type z } from "zod";
import {
  type ZodDiscriminatedObjectSchema,
  type ZodObjectSchema,
} from "~/utils/zod";

export interface IUseUpdateAutoTableData<
  TFormSchema extends ZodObjectSchema | ZodDiscriminatedObjectSchema,
> {
  onUpdate: (data: z.infer<TFormSchema>) => Promise<unknown>;
}

export const useUpdateAutoTableData = <
  TFormSchema extends ZodObjectSchema,
  TSchema extends ZodObjectSchema,
>({
  onUpdate,
}: IUseUpdateAutoTableData<TFormSchema>) => {
  const { selectedRow, currentAction, setCurrentAction } =
    useAutoTable<TSchema>();

  const { handleSubmitData } = useSubmitAutoTableData<TSchema>();

  const handleClose = () => {
    setCurrentAction(null);
  };

  const handleUpdate = async (data: z.infer<TFormSchema>) => {
    if (!selectedRow) {
      throw new Error("no selected row to update");
    }

    await handleSubmitData(async () => {
      await onUpdate(data);
    });
  };

  return {
    isUpdateActionAcitve: currentAction === "UPDATE",
    handleUpdate,
    handleClose,
  };
};
