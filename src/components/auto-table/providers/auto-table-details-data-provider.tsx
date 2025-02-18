import { type ZodObjectSchema, type ZodObjectInfer } from "~/utils/zod";
import React, { useState } from "react";

interface IAutoTableDetailsDataContext<
  TSchema extends ZodObjectSchema,
  TDetailsData extends Record<string, unknown>,
> {
  detailsData: TDetailsData | null;
  renderDetails: (data: TDetailsData) => React.ReactNode;
  getDetailsData: (row: ZodObjectInfer<TSchema>) => Promise<void>;
}

const AutoTableDetailsDataContext =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  React.createContext<IAutoTableDetailsDataContext<any, any> | null>(null);

export interface IAutoTableDetailsDataProvider<
  TSchema extends ZodObjectSchema,
  TDetailsData extends Record<string, unknown>,
> {
  renderDetails: (data: TDetailsData) => React.ReactNode;
  onDetails: (selectedRow: ZodObjectInfer<TSchema>) => Promise<TDetailsData>;
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
        getDetailsData: async (row: ZodObjectInfer<TSchema>) => {
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
