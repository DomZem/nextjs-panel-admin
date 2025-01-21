import { useAutoTable } from "~/components/modular-auto-table/auto-table-provider";
import { useSubmitAutoTableData } from "./use-submit-auto-table-data";
import {
  type StringOrNumberKeyOnly,
  type ZodObjectInfer,
  type ZodObjectSchema,
} from "~/utils/zod";

export interface IUseUpdateAutoTableData<
  TFormSchema extends ZodObjectSchema,
  TSchema extends ZodObjectSchema,
> {
  onUpdate: (
    data: {
      id: Extract<StringOrNumberKeyOnly<ZodObjectInfer<TSchema>>, string>;
    } & ZodObjectInfer<TFormSchema>,
  ) => Promise<unknown>;
}

export const useUpdateAutoTableData = <
  TFormSchema extends ZodObjectSchema,
  TSchema extends ZodObjectSchema,
  TDetailsData extends Record<string, unknown>,
>({
  onUpdate,
}: IUseUpdateAutoTableData<TFormSchema, TSchema>) => {
  const { selectedRow, rowIdentifierKey, currentAction, setCurrentAction } =
    useAutoTable<TSchema, TDetailsData>();

  const { handleSubmitData } = useSubmitAutoTableData<TSchema, TDetailsData>();

  const handleClose = () => {
    setCurrentAction(null);
  };

  const handleUpdate = async (
    data: {
      id: Extract<StringOrNumberKeyOnly<ZodObjectInfer<TSchema>>, string>;
    } & ZodObjectInfer<TFormSchema>,
  ) => {
    if (!selectedRow) {
      throw new Error("No selected row to update");
    }

    await handleSubmitData(async () => {
      await onUpdate({
        ...data,
        id: selectedRow[rowIdentifierKey],
      });
    });
  };

  return {
    isUpdateActionAcitve: currentAction === "UPDATE",
    handleUpdate,
    handleClose,
  };
};
