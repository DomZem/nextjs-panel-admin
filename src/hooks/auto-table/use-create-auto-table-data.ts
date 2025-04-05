import { useAutoTable } from "~/components/auto-table/providers/auto-table-provider";
import { useSubmitAutoTableData } from "./use-submit-auto-table-data";
import {
  type ZodDiscriminatedObjectSchema,
  type ZodObjectSchema,
} from "~/utils/zod";
import { type z } from "zod";

export interface IUseCreateAutoTableData<
  TFormSchema extends ZodObjectSchema | ZodDiscriminatedObjectSchema,
> {
  onCreate: (data: z.infer<TFormSchema>) => Promise<unknown>;
}

export const useCreateAutoTableData = <
  TFormSchema extends ZodObjectSchema | ZodDiscriminatedObjectSchema,
  TSchema extends ZodObjectSchema,
>({
  onCreate,
}: IUseCreateAutoTableData<TFormSchema>) => {
  const { currentAction, setCurrentAction } = useAutoTable<TSchema>();
  const { handleSubmitData } = useSubmitAutoTableData<TSchema>();

  const handleClose = () => {
    setCurrentAction(null);
  };

  const handleCreate = async (data: z.infer<TFormSchema>) => {
    await handleSubmitData(async () => {
      await onCreate(data);
    });
  };

  return {
    isCreateActionActive: currentAction === "CREATE",
    handleCreate,
    handleClose,
  };
};
