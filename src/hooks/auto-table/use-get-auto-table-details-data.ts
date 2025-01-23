import { useAutoTableDetailsData } from "~/components/modular-auto-table/auto-table-details-data-provider";
import {
  type ZodObjectSchemaIdentifierKey,
  type ZodObjectSchema,
} from "~/utils/zod";

export interface IUseGetAutoTableDetailsData<
  TSchema extends ZodObjectSchema,
  TDetailsData extends Record<string, unknown>,
> {
  onDetails: (args: {
    id: ZodObjectSchemaIdentifierKey<TSchema>;
  }) => Promise<TDetailsData>;
}

export const useGetAutoTableDetailsData = <
  TSchema extends ZodObjectSchema,
  TDetailsData extends Record<string, unknown>,
>({
  onDetails,
}: IUseGetAutoTableDetailsData<TSchema, TDetailsData>) => {
  const { setDetailsData } = useAutoTableDetailsData<TDetailsData>();

  const handleGetDetailsData = async (
    rowId: ZodObjectSchemaIdentifierKey<TSchema>,
  ) => {
    setDetailsData(null);
    const data = await onDetails({ id: rowId });
    setDetailsData(data);
  };

  return {
    handleGetDetailsData,
  };
};
