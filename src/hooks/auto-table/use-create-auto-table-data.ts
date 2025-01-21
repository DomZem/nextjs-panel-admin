import { useAutoTable } from "~/components/modular-auto-table/auto-table-provider";
import { type ZodObjectInfer, type ZodObjectSchema } from "~/utils/zod";
import { useSubmitAutoTableData } from "./use-submit-auto-table-data";

export interface IUseCreateAutoTableData<TFormSchema extends ZodObjectSchema> {
  onCreate: (data: ZodObjectInfer<TFormSchema>) => Promise<unknown>;
}

export const useCreateAutoTableData = <
  TFormSchema extends ZodObjectSchema,
  TSchema extends ZodObjectSchema,
  TDetailsData extends Record<string, unknown>,
>({
  onCreate,
}: IUseCreateAutoTableData<TFormSchema>) => {
  const { currentAction, setCurrentAction } = useAutoTable<
    TSchema,
    TDetailsData
  >();

  const { handleSubmitData } = useSubmitAutoTableData<TSchema, TDetailsData>();

  const handleClose = () => {
    setCurrentAction(null);
  };

  const handleCreate = async (data: ZodObjectInfer<TFormSchema>) => {
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
