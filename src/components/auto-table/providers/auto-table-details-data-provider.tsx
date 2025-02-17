import { type ZodObjectSchema, type ZodObjectInfer } from "~/utils/zod";
import { useAutoTable } from "./auto-table-provider";
import React, { useState } from "react";

interface IAutoTableDetailsDataContext<
  TDetailsData extends Record<string, unknown>,
> {
  detailsData: TDetailsData | null;
  renderDetails: (data: TDetailsData) => React.ReactNode;
  getDetailsData: () => Promise<void>;
}

const AutoTableDetailsDataContext =
  React.createContext<IAutoTableDetailsDataContext<any> | null>(null);

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
  const { selectedRow } = useAutoTable<TSchema>();

  const handleGetDetailsData = async () => {
    if (!selectedRow) return;

    const data = await onDetails(selectedRow);

    setDetailsData(data);
  };

  return (
    <AutoTableDetailsDataContext.Provider
      value={{
        detailsData,
        renderDetails,
        getDetailsData: handleGetDetailsData,
      }}
    >
      {children}
    </AutoTableDetailsDataContext.Provider>
  );
};

export const useAutoTableDetailsData = <
  TDetailsData extends Record<string, unknown>,
>() => {
  const context = React.useContext(
    AutoTableDetailsDataContext as React.Context<IAutoTableDetailsDataContext<TDetailsData> | null>,
  );

  if (!context) {
    throw new Error(
      "useAutoTableDetailsData must be used within an AutoTableDetailsDataProvider",
    );
  }

  return context;
};
