import { type ZodObjectSchema } from "~/utils/zod";
import React, { useState } from "react";
import { type z } from "zod";

interface IAutoTableDetailsDataContext<
  TSchema extends ZodObjectSchema,
  TDetailsData extends Record<string, unknown>,
> {
  detailsData: TDetailsData | null;
  renderDetails: (data: TDetailsData) => React.ReactNode;
  getDetailsData: (row: z.infer<TSchema>) => Promise<void>;
}

const AutoTableDetailsDataContext =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  React.createContext<IAutoTableDetailsDataContext<any, any> | null>(null);

export interface IAutoTableDetailsDataProvider<
  TSchema extends ZodObjectSchema,
  TDetailsData extends Record<string, unknown>,
> {
  renderDetails: (data: TDetailsData) => React.ReactNode;
  onDetails: (selectedRow: z.infer<TSchema>) => Promise<TDetailsData>;
}

export const AutoTableDetailsDataProvider = <
  TSchema extends ZodObjectSchema,
  TDetailsData extends Record<string, unknown>,
>({
  renderDetails,
  onDetails,
  children,
}: IAutoTableDetailsDataProvider<TSchema, TDetailsData> & {
  children: React.ReactNode;
}) => {
  const [detailsData, setDetailsData] = useState<TDetailsData | null>(null);

  return (
    <AutoTableDetailsDataContext.Provider
      value={{
        detailsData,
        renderDetails,
        getDetailsData: async (row: z.infer<TSchema>) => {
          const data = await onDetails(row);
          setDetailsData(data);
        },
      }}
    >
      {children}
    </AutoTableDetailsDataContext.Provider>
  );
};

export const useAutoTableDetailsData = <
  TSchema extends ZodObjectSchema,
  TDetailsData extends Record<string, unknown>,
>() => {
  const context = React.useContext(
    AutoTableDetailsDataContext as React.Context<IAutoTableDetailsDataContext<
      TSchema,
      TDetailsData
    > | null>,
  );

  if (!context) {
    throw new Error(
      "useAutoTableDetailsData must be used within an AutoTableDetailsDataProvider",
    );
  }

  return context;
};
