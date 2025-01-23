import React, { useState } from "react";

interface IAutoTableDetailsDataContext<
  TDetailsData extends Record<string, unknown>,
> {
  detailsData: TDetailsData | null;
  setDetailsData: (data: TDetailsData | null) => void;
  renderDetails: (data: TDetailsData) => React.ReactNode;
}

const AutoTableDetailsDataContext =
  React.createContext<IAutoTableDetailsDataContext<any> | null>(null);

export const AutoTableDetailsDataProvider = <
  TDetailsData extends Record<string, unknown>,
>({
  renderDetails,
  children,
}: {
  renderDetails: (data: TDetailsData) => React.ReactNode;
  children: React.ReactNode;
}) => {
  const [detailsData, setDetailsData] = useState<TDetailsData | null>(null);

  return (
    <AutoTableDetailsDataContext.Provider
      value={{
        detailsData,
        setDetailsData: (data) => setDetailsData(data as TDetailsData),
        renderDetails,
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
